const DATASET_URL =
  'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json'

let baseTemperature

const render = (data) => {
  const width = 1500
  const height = 700
  const margin = { top: 60, right: 60, bottom: 60, left: 60 }
  const innerHeight = height - margin.top - margin.bottom
  const innerWidth = width - margin.left - margin.right

  const cellHeight = innerHeight / 12
  const cellWidth = innerWidth / Math.floor(data.length / 12)

  const minTemp = d3.min(data, (d) => baseTemperature + d.variance)
  const maxTemp = d3.max(data, (d) => baseTemperature + d.variance)
  const minYear = d3.min(data, (d) => d.year)
  const maxYear = d3.max(data, (d) => d.year)

  const colors = d3
    .scaleThreshold()
    .domain(d3.range(minTemp, maxTemp, (maxTemp - minTemp) / 9))
    .range(d3.schemeGreens[9])

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  // SVG
  const svg = d3
    .select('#chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height)

  // Tooltip
  const tooltip = d3
    .select('#chart')
    .append('div')
    .attr('id', 'tooltip')
    .style('opacity', 0)

  // xAxis
  const xScale = d3
    .scaleLinear()
    .domain([minYear, maxYear + 1])
    .range([margin.left, width - margin.right])

  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'))

  svg
    .append('g')
    .call(xAxis)
    .attr('id', 'x-axis')
    .attr('transform', `translate(0, ${height - margin.bottom - 12})`)

  // yAxis
  const yScale = d3
    .scaleLinear()
    .domain([0, 11])
    .range([margin.top, innerHeight])

  const yAxis = d3.axisLeft(yScale).tickFormat((month) => months[month])

  svg
    .append('g')
    .call(yAxis)
    .attr('id', 'y-axis')
    .attr('transform', `translate(${margin.top}, 20)`)

  // Enter data
  svg
    .selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'cell')
    .attr('data-month', (d) => d.month - 1)
    .attr('data-year', (d) => d.year)
    .attr('data-temp', (d) => baseTemperature + d.variance)
    .attr('x', (d) => xScale(d.year))
    .attr('y', (d) => yScale(d.month - 1))
    .attr('width', cellWidth)
    .attr('height', cellHeight)
    .attr('fill', (d) => colors(Math.floor(baseTemperature + d.variance)))
    .on('mouseover', (d, i) => {
      d3.select(d3.event.currentTarget).style('fill', 'white')
      tooltip.transition().style('opacity', '1')
      tooltip.html(
        `${d.year} - ${months[d.month - 1]} - ${(
          baseTemperature + d.variance
        ).toFixed(3)}&deg;C (Variance: ${d.variance})`
      )
      tooltip
        .attr('data-year', d.year)
        .style('left', `${d3.event.pageX + 10}px`)
        .style('top', `${d3.event.pageY - 20}px`)
    })
    .on('mouseout', (d, i) => {
      d3.select(d3.event.currentTarget).style(
        'fill',
        colors(Math.floor(baseTemperature + d.variance))
      )
      tooltip.transition().style('opacity', '0')
    })

  // Legend
  const legendWidth = 200

  const legendScale = d3
    .scaleLinear()
    .domain([minTemp, maxTemp])
    .range([margin.left, margin.left + legendWidth])

  const legend = svg
    .append('g')
    .attr('id', 'legend')
    .attr('transform', `translate(0, ${margin.top + innerHeight + 20})`)

  legend
    .selectAll('rect')
    .data(
      colors.range().map((d) => {
        d = colors.invertExtent(d)
        if (d[0] === null) {
          d[0] = legendScale.domain()[0]
        }
        if (d[1] === null) {
          d[1] = legendScale.domain()[1]
        }
        return d
      })
    )
    .enter()
    .append('rect')
    .attr('height', 10)
    .attr('x', (d) => legendScale(d[0]))
    .attr('width', (d) => {
      return d[0] && d[1]
        ? legendScale(d[1]) - legendScale(d[0])
        : legendScale(null)
    })
    .attr('fill', (d) => colors(d[0]))
    .on('mouseover', function (type) {
      d3.selectAll('.cell')
        .style('opacity', 0.1)
        .filter(
          (d) =>
            colors(Math.floor(baseTemperature + d.variance)) === colors(type[0])
        )
        .style('opacity', 1)
    })
    .on('mouseleave', () => {
      d3.selectAll('.cell').style('opacity', 1)
    })

  legend
    .call(
      d3
        .axisBottom(legendScale)
        .tickSize(13)
        .tickFormat((x) => Math.round(x))
        .tickValues(colors.domain())
    )
    .select('.domain')
    .remove()
}

const main = async () => {
  try {
    const data = await d3.json(DATASET_URL)
    baseTemperature = data.baseTemperature
    render(data.monthlyVariance)
  } catch (err) {
    throw new Error(err.message)
  }
}

main()
