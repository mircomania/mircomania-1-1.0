"""Build the public historical snapshot without exporting campaign spend.

Usage: python3 scripts/import_mejoravit_history.py /path/to/report.xml [--check]
Channel classification and conversion context were confirmed by the case owner.
They are not fields supplied by this XML export.
"""

import argparse
import hashlib
import json
import re
from collections import defaultdict
from decimal import Decimal, ROUND_HALF_UP
from pathlib import Path
import xml.etree.ElementTree as ET

MONTHS = "enero febrero marzo abril mayo junio julio agosto septiembre octubre noviembre diciembre".split()
SEARCH = ["Mi Cuenta MX", "Mi Cuenta NL"]
PMAX = ["Mi cuenta | Max | MIX", "Mi cuenta | Max | NL"]
OUTPUT = Path(__file__).resolve().parents[1] / "src/data/ads/mejoravit-history.json"


def number(value):
    if not re.fullmatch(r"(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?", value or ""):
        raise ValueError("Formato numérico inesperado")
    return Decimal(value.replace(",", ""))


def metric(rows):
    conversions = sum((row["conversions"] for row in rows), Decimal(0))
    cost = sum((row["cost"] for row in rows), Decimal(0))
    cpa = (cost / conversions).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP) if conversions else None
    return {"conversions": float(conversions), "costPerConversion": float(cpa) if cpa is not None else None}


def build_snapshot(xml_bytes):
    root = ET.fromstring(xml_bytes)
    rows = []
    pairs = set()
    for element in root.findall("./table/row"):
        fields = {cell.findtext("key"): cell.findtext("value") for cell in element.findall("cell")}
        if fields.get("Código de moneda") != "MXN":
            raise ValueError("El informe debe contener únicamente MXN")
        match = re.fullmatch(r"([a-z]+) de (\d{4})", fields.get("Mes", ""))
        if not match or match[1] not in MONTHS:
            raise ValueError("Mes no reconocido")
        month = f"{match[2]}-{MONTHS.index(match[1]) + 1:02d}"
        campaign = (fields.get("Campaña") or "").strip()
        if not campaign or (month, campaign) in pairs:
            raise ValueError("Campaña ausente o par mes/campaña duplicado")
        if not "2025-06" <= month <= "2026-10":
            raise ValueError("El registro está fuera del período histórico del caso")
        pairs.add((month, campaign))
        conversions = number(fields.get("Conversiones"))
        cost = number(fields.get("Costo"))
        exported_cpa = number(fields.get("Costo/conv."))
        if conversions and abs(cost / conversions - exported_cpa) >= Decimal("0.01"):
            raise ValueError("El CPA exportado no coincide con costo / conversiones")
        rows.append({"month": month, "campaign": campaign, "conversions": conversions, "cost": cost})

    if not rows:
        raise ValueError("El informe no contiene registros")
    grouped = defaultdict(list)
    for row in rows:
        grouped[row["month"]].append(row)
    expected = [f"{year}-{month:02d}" for year in [2025, 2026] for month in range(1, 13)
                if "2025-06" <= f"{year}-{month:02d}" <= "2026-10"]
    monthly = [
        {"month": month, **(metric(grouped[month]) if grouped[month] else {"conversions": None, "costPerConversion": None}), "partial": month == "2026-10"}
        for month in expected
    ]
    october = [row for row in rows if row["month"] == "2026-10"]
    channels = []
    for name, campaigns in [("Google Search", SEARCH), ("Performance Max", PMAX)]:
        selected = [row for row in october if row["campaign"] in campaigns]
        complete = {row["campaign"] for row in selected} == set(campaigns)
        channels.append({"name": name, "campaigns": campaigns, "complete": complete,
                         **(metric(selected) if complete else {"conversions": None, "costPerConversion": None})})
    return {
        "source": {"file": "Informe sin título (1).xml", "sha256": hashlib.sha256(xml_bytes).hexdigest(),
                   "rowCount": len(rows), "currency": "MXN", "conversionColumn": "Conversiones",
                   "reportedDateRange": root.findtext("date-range"), "octoberCutoff": None},
        "period": {"startMonth": "2025-06", "endMonth": "2026-10", "calendarMonths": 17, "partialEndMonth": True},
        "totals": metric(rows),
        "monthly": monthly,
        "comparison": {"month": "2026-10", "partial": True, "family": "Mi Cuenta · Mejoravit 4",
                       "classificationSource": "Confirmación del responsable del caso, 30 de octubre de 2026",
                       "primaryActionReported": "formulario_enviado", "actionIdsAvailableInExport": False,
                       "channels": channels, "excludedCampaigns": ["En Linea NL"]},
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("xml", type=Path)
    parser.add_argument("--check", action="store_true", help="Verify the committed snapshot without writing")
    args = parser.parse_args()
    snapshot = build_snapshot(args.xml.read_bytes())
    rendered = json.dumps(snapshot, ensure_ascii=False, indent=4) + "\n"
    if args.check:
        if not OUTPUT.exists() or OUTPUT.read_text(encoding="utf-8") != rendered:
            raise SystemExit("El snapshot no coincide con el XML")
        print("Snapshot verificado contra el XML; sin publicar gasto de campañas.")
    else:
        OUTPUT.parent.mkdir(parents=True, exist_ok=True)
        OUTPUT.write_text(rendered, encoding="utf-8")
        print("Snapshot público generado; no contiene gasto de campañas.")
