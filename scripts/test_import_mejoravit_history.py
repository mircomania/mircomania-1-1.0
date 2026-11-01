import json
import unittest
from decimal import Decimal
import xml.etree.ElementTree as ET

from import_mejoravit_history import build_snapshot, metric, number


def report(records):
    root = ET.Element("report")
    table = ET.SubElement(root, "table")
    for overrides in records:
        fields = {"Mes": "octubre de 2026", "Campaña": "Mi Cuenta MX", "Código de moneda": "MXN",
                  "Conversiones": "10.00", "Costo": "100.00", "Costo/conv.": "10.00", **overrides}
        row = ET.SubElement(table, "row")
        for key, value in fields.items():
            cell = ET.SubElement(row, "cell")
            ET.SubElement(cell, "key").text = key
            ET.SubElement(cell, "value").text = value
    return ET.tostring(root)


class ImportMejoravitHistoryTests(unittest.TestCase):
    def test_uses_weighted_cpa_instead_of_mean_campaign_cpas(self):
        self.assertEqual(metric([{"cost": Decimal(10), "conversions": Decimal(1)},
                                 {"cost": Decimal(90), "conversions": Decimal(90)}]),
                         {"conversions": 91.0, "costPerConversion": 1.10})

    def test_retains_cost_from_zero_conversion_campaigns(self):
        self.assertEqual(metric([{"cost": Decimal(50), "conversions": Decimal(0)},
                                 {"cost": Decimal(50), "conversions": Decimal(10)}])["costPerConversion"], 10.0)
        self.assertIsNone(metric([{"cost": Decimal(50), "conversions": Decimal(0)}])["costPerConversion"])

    def test_missing_months_are_gaps_and_incomplete_comparisons_are_withheld(self):
        snapshot = build_snapshot(report([{}]))
        self.assertEqual(len(snapshot["monthly"]), 17)
        self.assertIsNone(snapshot["monthly"][0]["costPerConversion"])
        self.assertIsNone(snapshot["monthly"][0]["conversions"])
        self.assertTrue(snapshot["monthly"][-1]["partial"])
        self.assertFalse(snapshot["comparison"]["channels"][0]["complete"])
        self.assertIsNone(snapshot["comparison"]["channels"][0]["conversions"])

    def test_excludes_other_families_from_comparison_but_keeps_them_in_history(self):
        snapshot = build_snapshot(report([{"Campaña": name} for name in [
            "Mi Cuenta MX", "Mi Cuenta NL", "Mi cuenta | Max | MIX", "Mi cuenta | Max | NL", "En Linea NL"]]))
        self.assertEqual(snapshot["totals"]["conversions"], 50.0)
        self.assertEqual([c["conversions"] for c in snapshot["comparison"]["channels"]], [20.0, 20.0])
        self.assertTrue(all(c["complete"] for c in snapshot["comparison"]["channels"]))
        self.assertNotIn('"cost":', json.dumps(snapshot))

    def test_rejects_duplicate_rows_wrong_currency_and_inconsistent_cpa(self):
        for records in [[{}, {}], [{"Código de moneda": "USD"}], [{"Costo/conv.": "20.00"}], []]:
            with self.subTest(records=records), self.assertRaises(ValueError):
                build_snapshot(report(records))

    def test_preserves_export_number_format_and_rejects_ambiguous_locale(self):
        self.assertEqual(number("1,522.51"), Decimal("1522.51"))
        for value in ["1.522,51", "1,52", "NaN", "-1", None]:
            with self.subTest(value=value), self.assertRaises(ValueError):
                number(value)


if __name__ == "__main__":
    unittest.main()
