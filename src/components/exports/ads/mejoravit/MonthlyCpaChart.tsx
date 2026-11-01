import { formatConversions, formatHistoryMonth, formatMxn } from '@/data/ads/mejoravit';
import type { MonthlyCpaPoint } from '@/data/ads/mejoravit';

import { CPA_CHART, getCpaGeometry } from './cpaGeometry';
import styles from './mejoravit.module.css';

export default function MonthlyCpaChart({ data }: Readonly<{ data: readonly MonthlyCpaPoint[] }>) {
    const chart = getCpaGeometry(data);
    const hasData = chart.points.some(Boolean);

    return (
        <figure className={styles.chartFigure}>
            <figcaption>
                <h3>Costo por conversión, mes a mes</h3>
                <p>Agregado mensual del conjunto de campañas · MXN</p>
            </figcaption>
            {hasData ? (
                <>
                    <p className={styles.scrollHint}>Puedes desplazar el gráfico horizontalmente. Los valores completos están en la tabla.</p>
                    <div
                        className={styles.chartScroll}
                        tabIndex={0}
                        role="region"
                        aria-label="Gráfico mensual de costo por conversión, desplazable horizontalmente"
                    >
                        <svg
                            viewBox={`0 0 ${CPA_CHART.width} ${CPA_CHART.height}`}
                            className={styles.chartSvg}
                            role="img"
                            aria-labelledby="mejoravit-cpa-title"
                            aria-describedby="mejoravit-cpa-description"
                        >
                            <title id="mejoravit-cpa-title">Evolución mensual del costo por conversión en pesos mexicanos</title>
                            <desc id="mejoravit-cpa-description">
                                Cada punto representa un mes del informe. La escala vertical comienza en cero. Los meses parciales se señalan con un
                                asterisco. Consulta la tabla para leer cada valor. Los datos ausentes interrumpen la línea.
                            </desc>
                            {chart.ticks.map((tick) => (
                                <g key={tick.value}>
                                    <line x1={CPA_CHART.left} x2={CPA_CHART.right} y1={tick.y} y2={tick.y} className={styles.gridLine} />
                                    <text x={CPA_CHART.left - 16} y={tick.y + 4} textAnchor="end" className={styles.axisText}>
                                        ${tick.value}
                                    </text>
                                </g>
                            ))}
                            {data.map(
                                (row, index) =>
                                    row.partial && (
                                        <rect
                                            key={row.month}
                                            x={chart.x(index) - 20}
                                            y={CPA_CHART.top}
                                            width={40}
                                            height={CPA_CHART.bottom - CPA_CHART.top}
                                            className={styles.partialBand}
                                        />
                                    ),
                            )}
                            {chart.segments.map((points, index) => (
                                <polyline key={index} points={points} className={styles.chartLine} />
                            ))}
                            {chart.points.map(
                                (point, index) =>
                                    point && (
                                        <circle
                                            key={data[index].month}
                                            cx={point.x}
                                            cy={point.y}
                                            r={point.row.partial ? 6 : 4}
                                            className={point.row.partial ? styles.partialPoint : styles.chartPoint}
                                        >
                                            <title>
                                                {`${formatHistoryMonth(point.row.month)}${point.row.partial ? ' (parcial)' : ''}: ${formatMxn(point.value)}`}
                                            </title>
                                        </circle>
                                    ),
                            )}
                            {data.map((row, index) => (
                                <text
                                    key={row.month}
                                    transform={`translate(${chart.x(index)},${CPA_CHART.bottom + 28}) rotate(-45)`}
                                    textAnchor="end"
                                    className={styles.axisText}
                                >
                                    {formatHistoryMonth(row.month, true)}
                                    {row.partial ? ' *' : ''}
                                </text>
                            ))}
                        </svg>
                    </div>
                </>
            ) : (
                <p className={styles.dataState}>No hay datos suficientes para representar el costo por conversión de este período.</p>
            )}
            <p className={styles.chartNote}>
                CPA mensual = suma del costo de las campañas / suma de sus conversiones. Se incluye el costo de las campañas sin conversiones; no se
                promedian los CPA individuales.
            </p>
            {data.length > 0 && (
                <details className={styles.dataDetails}>
                    <summary>Consultar los datos del gráfico</summary>
                    <div className={styles.tableScroll} tabIndex={0} role="region" aria-label="Tabla de datos mensuales, desplazable horizontalmente">
                        <table className={styles.dataTable}>
                            <caption>Valores mensuales de la columna Conversiones del informe y su costo agregado por conversión.</caption>
                            <thead>
                                <tr>
                                    <th scope="col">Mes</th>
                                    <th scope="col">Conversiones</th>
                                    <th scope="col">Costo por conversión</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((row, index) => (
                                    <tr key={row.month}>
                                        <th scope="row">{formatHistoryMonth(row.month)}</th>
                                        <td>
                                            {row.conversions !== null && Number.isFinite(row.conversions) && row.conversions >= 0
                                                ? formatConversions(row.conversions)
                                                : 'No disponible'}
                                        </td>
                                        <td>{chart.points[index] ? formatMxn(chart.points[index].value) : 'No disponible'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </details>
            )}
        </figure>
    );
}
