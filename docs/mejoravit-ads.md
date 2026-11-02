# Mejoravit Ads: mantenimiento del estudio

## Propósito y estado

`/ads/mejoravit` presenta una experiencia profesional de captación de clientes potenciales mediante Google Ads en PRO Consultores (México). Es un estudio histórico, con contexto estratégico y límites de comparación; no consulta Google Ads en tiempo real ni equipara conversiones con ventas o clientes cerrados.

La implementación está versionada en GitHub. Los tests y verificaciones locales comunicados durante el desarrollo no acreditan publicación: quedan pendientes aprobación de staging y despliegue de esta actualización. La relación con el catálogo y los proyectos se detalla en [architecture.md](architecture.md); el esquema, en [database.md](database.md).

## Archivos y flujo de datos

| Archivo | Función |
| --- | --- |
| [import_mejoravit_history.py](../scripts/import_mejoravit_history.py) | Lee el XML, valida filas y genera el snapshot público; `--check` compara sin escribir. |
| [mejoravit-history.json](../src/data/ads/mejoravit-history.json) | Snapshot versionado con procedencia, período, totales, 17 agregados mensuales y comparación de canales; no publica inversión. |
| [mejoravit.ts](../src/data/ads/mejoravit.ts) | Exporta el snapshot, `mejoravitCommercialReport` y formateadores `es-CL`; meses con zona UTC y CPA en MXN. |
| [page.tsx](../src/app/(site)/ads/mejoravit/page.tsx) | Compone el estudio y sus textos, métricas, contexto profesional y CTA. |
| [MonthlyCpaChart.tsx](../src/components/exports/ads/mejoravit/MonthlyCpaChart.tsx) | SVG de servidor, tooltips y tabla histórica alternativa. |
| [cpaGeometry.ts](../src/components/exports/ads/mejoravit/cpaGeometry.ts) | Escala desde cero, coordenadas y cortes ante datos ausentes o inválidos. |

Flujo: XML externo → Python → JSON revisado y versionado → helpers → React/SVG. Publicar un caso en `ads_cases` no modifica el JSON ni crea una página; actualizar el JSON tampoco sincroniza las métricas de las tarjetas remotas.

## Fuente y período

El snapshot actual registra 42 filas de un export denominado `Informe sin título (1).xml`, moneda MXN y columna `Conversiones`. Cubre junio de 2025 a octubre de 2026: 17 meses, con octubre parcial. `reportedDateRange` conserva “Todo el período”, que no identifica el día de corte; `source.octoberCutoff` es `null`. No deducir ese día del reporte comercial, que tiene otro período.

`source.sha256` identifica los bytes exactos del XML usado. Si se conserva el original fuera del repositorio, puede comprobarse con `sha256sum /ruta/informe.xml` y comparar el resultado con ese campo. El hash acredita identidad del archivo, no exactitud de las métricas ni equivalencia de acciones de conversión. El XML no se incluye en el repositorio; preservar su respaldo con acceso adecuado, sin copiar información privada a los documentos públicos. El nombre `source.file` está fijado en el script, no se obtiene del argumento de entrada.

## Métricas y metodología

- **Conversiones registradas:** suma de `Conversiones`, que admite fracciones; no es necesariamente un recuento de personas únicas, ventas o trámites cerrados. No usar `Resultados` ni `Todas las conversiones` para sustituir esta columna.
- **CPA agregado:** suma de `Costo` / suma de `Conversiones` en las filas seleccionadas, con `Decimal` y redondeo `ROUND_HALF_UP` a dos decimales. Incluye el costo de campañas con cero conversiones; nunca promedia CPA individuales. Con cero conversiones agregadas, el CPA es `null`.
- **Histórico mensual y totales:** consideran todas las campañas admitidas del export, agrupadas por mes. El snapshot actual suma 34.795,10 conversiones y CPA de $15,29 MXN; el encabezado del estudio redondea las conversiones a entero mediante `formatWholeNumber`.
- **Gráfico:** conserva los 17 meses, marca octubre parcial e interrumpe la línea ante ausencia de un punto válido. Un mes sin filas queda con métricas `null`, no con cero. Los tooltips contienen una única cadena para SSR; los valores también están en la tabla accesible.

El costo se utiliza durante la importación, pero no se exporta al JSON. No añadir inversión total o por campaña, registros de leads ni otros datos privados a esta documentación o al snapshot.

## Search frente a Performance Max

La comparación es de **Mi Cuenta — Mejoravit 4**, únicamente en octubre de 2026 parcial, no del conjunto completo de campañas Mejoravit. La clasificación está fijada por nombre en Python y registrada en `comparison`:

- Search: `Mi Cuenta MX` y `Mi Cuenta NL`.
- Performance Max: `Mi cuenta | Max | MIX` y `Mi cuenta | Max | NL`.
- Excluida de esta comparación: `En Linea NL`, de otra familia/landing según confirmación del responsable. Sus filas sí participan en el histórico y total general cuando están presentes.

Para cada canal se requiere que estén sus dos campañas; si falta alguna, `complete` es falso y sus métricas se publican como `null`. Los CPA se agregan mediante costo total / conversiones totales del canal. Actualmente Search registra 1.522,51 conversiones y $16,43 MXN por conversión; PMax, 3.168,73 y $7,98 MXN.

La clasificación y `primaryActionReported = formulario_enviado` proceden de confirmación manual del responsable, fechada en el snapshot el 30 de octubre de 2026. El XML no aporta los identificadores de acciones (`actionIdsAvailableInExport = false`), por lo que no permite verificar identidad exacta de conversión entre campañas. La comparación es descriptiva: audiencias, segmentación y condiciones de entrega pueden diferir; no demuestra causalidad ni constituye un experimento controlado.

## Calidad comercial

`mejoravitCommercialReport` es independiente del XML: reporta aproximadamente 6.775 contactos evaluados, 4.935 útiles y unos 1.840 restantes entre el **27 de septiembre y el 26 de octubre de 2026**, con 72,8 % útil redondeado. Es clasificación comercial reportada, no una métrica nativa de Google Ads ni una tasa de ventas/cierres.

`originalDocumentAvailable = false` e `individuallyReconciledWithAds = false` explicitan que no se dispone aquí del documento original ni de conciliación individual con las conversiones publicitarias. Actualizar ese indicador requiere una fuente comercial propia; regenerar el JSON desde el XML no lo verifica ni modifica.

## Procedimiento de actualización

1. Obtener un export comparable y conservar el original fuera del repositorio público. Verificar período, moneda y definición de conversión con el responsable; registrar un corte exacto solo si existe evidencia.
2. Revisar la estructura y las campañas antes de ejecutar nada. El script espera `./table/row`, celdas `key`/`value` y claves exactas `Mes`, `Campaña`, `Código de moneda`, `Conversiones`, `Costo` y `Costo/conv.`. Los meses están en español (`octubre de 2026`) y los números usan punto decimal y coma de miles (`1,522.51`); no acepta negativos ni formatos locales alternativos.
3. Revisar qué filas deben integrar el histórico y cuáles los canales. El histórico incluye todas las campañas del export; la comparación solo los cuatro nombres fijados. No incorporar otra familia por conveniencia ni asumir que nombres nuevos equivalen a los existentes.
4. Para comprobar el snapshot actual sin escribir:

   ```bash
   python3 scripts/import_mejoravit_history.py /ruta/informe.xml --check
   ```

   `--check` reconstruye el snapshot y exige igualdad textual con el JSON generado (incluidos metadatos, hash y formato); falla si falta el archivo de salida o difiere. No basta con que coincidan los agregados. Sin `--check`, el comando **sobrescribe** la ruta de salida fija:

   ```bash
   python3 scripts/import_mejoravit_history.py /ruta/informe.xml
   git diff -- src/data/ads/mejoravit-history.json
   ```

5. Revisar el diff completo: hash/procedencia, filas, 17 meses, parcialidad, totales, ausencia de inversión y comparación completa. El importador rechaza duplicados mes/campaña, moneda distinta, filas fuera del rango, export vacío y discrepancias de CPA de al menos 0,01 respecto de costo/conversiones cuando hay conversiones. No valida por sí solo que estén todas las campañas esperadas del histórico.
6. Ejecutar los controles pertinentes:

   ```bash
   python3 -m unittest discover -s scripts -p 'test_*.py'
   npm test
   npm run lint
   npm run build
   ```

   [Tests Python](../scripts/test_import_mejoravit_history.py) cubren ponderación del CPA, costo sin conversiones, ausencias, exclusión de otras familias, duplicados, moneda y formato. [Tests de datos](../src/data/ads/mejoravit.test.ts) fijan valores/hash del snapshot y límites del reporte comercial; [tests del gráfico](../src/components/exports/ads/mejoravit/MonthlyCpaChart.test.ts) revisan escala, 17 tooltips SSR, datos ausentes y tabla. Cambiar expectativas requiere revisar la nueva evidencia, no adaptar aserciones para ocultar diferencias.
7. Validar cálculos, etiquetas, tooltips, tabla y ausencia de errores de hidratación en navegador, desktop y móvil; comprobar también la compilación de producción. Revisar los textos derivados: el descenso del CPA agosto–octubre y la comparación porcentual son copy escrito en la página, no cálculos automáticos del JSX.
8. Revisar los destacados de `/ads` y de la fila `ads_cases` cuando corresponda: son fuentes editoriales independientes. El hero de `/ads` usa un período propio (27 de septiembre–26 de octubre de 2026), no el total del histórico. Coordinar cualquier cambio remoto y los textos con el propietario; no convertir esta revisión en una migration automática de contenido. Mantener separado el proyecto web original del destacado publicitario `mejoravit-ads`.

## Restricciones y reutilización

El importador está especializado: rango fijo `2025-06`–`2026-10`, 17 meses, MXN, octubre marcado parcial, cuatro campañas y familia fijadas, nombre de fuente y salida fijos. No acepta automáticamente otros períodos, monedas o casos; un rango nuevo exige adaptar y revisar metodología, script, metadatos, tests y copy en otra tarea. El XML no resuelve por sí solo la fecha parcial, identidad de acciones ni comparabilidad comercial.

Separar siempre: **verificado mediante código** (formato, agregados, integridad del archivo y renderizado probado), **reportado comercialmente** (calidad de leads) y **confirmado manualmente** (familia, clasificación y acción principal). La precisión aritmética no elimina las limitaciones de origen y comparación.

Para otros estudios podrían reutilizarse el parsing numérico con `Decimal`, la agregación ponderada, las validaciones y el patrón de snapshot público sin gasto. La clasificación, calendario, formato de export, metadatos y reglas editoriales requieren diseño específico; el script actual no es un importador genérico.
