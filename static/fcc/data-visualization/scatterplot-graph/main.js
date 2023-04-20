const DATASET_URL =
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'

const render = (data) => {
  const width = 1000
  const height = 500
  const margin = { top: 60, right: 60, bottom: 20, left: 80 }
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom

  // SVG
  const svg = d3
    .select('#chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height)

  const color = d3.scaleOrdinal(d3.schemeCategory10)
  const timeFormat = d3.timeFormat('%M:%S')

  // xAxis
  const yearsArray = data.map((d) => d.Year)

  const xScale = d3
    .scaleLinear()
    .domain(d3.extent(yearsArray))
    .range([0, innerWidth])
    .nice()

  const xAxis = d3.axisBottom(xScale).tickFormat(d3.format('d'))

  svg
    .append('g')
    .call(xAxis)
    .attr('id', 'x-axis')
    .attr('transform', `translate(${margin.left}, ${innerHeight})`)

  svg
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -300)
    .attr('y', 35)
    .text('Time (in minutes) ➝')

  // yAxis
  const timesArray = data.map((d) => {
    const parsedTime = d.Time.split(':')
    d.Time = new Date(Date.UTC(1970, 0, 1, 0, parsedTime[0], parsedTime[1]))
    return d.Time
  })

  const yScale = d3
    .scaleTime()
    .domain(d3.extent(timesArray))
    .range([0, innerHeight])
    .nice()

  const yAxis = d3.axisLeft(yScale).tickFormat(timeFormat)

  svg
    .append('g')
    .call(yAxis)
    .attr('id', 'y-axis')
    .attr('transform', `translate(${margin.left}, 0)`)

  svg
    .append('text')
    .attr('x', 500)
    .attr('y', height - 20)
    .text('Year ➝')

  // Tooltip
  const tooltip = d3
    .select('#chart')
    .append('div')
    .attr('id', 'tooltip')
    .style('opacity', 0)

  // Enter data
  svg
    .selectAll('.dot')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', 'dot')
    .attr('r', 5)
    .attr('cx', (d) => xScale(d.Year) + margin.left)
    .attr('cy', (d) => yScale(d.Time))
    .attr('data-xvalue', (d) => d.Year)
    .attr('data-yvalue', (d) => d.Time.toISOString())
    .style('fill', (d) => color(d.Doping !== ''))
    .style('stroke', 'black')
    .on('mouseover', function (d) {
      d3.select(this).attr('r', 6)
      tooltip.transition().duration(250).style('opacity', 0.9)
      tooltip
        .html(
          `${d.Name}, ${d.Nationality}, ${d.Year}, ${timeFormat(d.Time)}` +
            (d.Doping ? '<br/><br/>' + d.Doping : '')
        )
        .attr('data-year', d.Year)
        .style('left', `${d3.event.pageX + 30}px`)
        .style('top', `${d3.event.pageY - 80}px`)
    })
    .on('mouseout', function () {
      d3.select(this).attr('r', 5)
      tooltip.transition().duration(250).style('opacity', 0)
    })

  // Legend
  const legend = svg
    .append('g')
    .attr('id', 'legend')
    .selectAll('#legend')
    .data(color.domain())
    .enter()
    .append('g')
    .attr('class', 'legend-label')
    .attr('transform', function (d, i) {
      return 'translate(-30,' + (height / 15 - i * 30) + ')'
    })

  legend
    .append('rect')
    .attr('x', width - 18)
    .attr('width', 15)
    .attr('height', 15)
    .style('fill', color)

  legend
    .append('text')
    .attr('x', width - 24)
    .attr('y', 9)
    .attr('dy', '5px')
    .style('text-anchor', 'end')
    .text((d) => (d ? 'Doping allegations' : 'No doping allegations'))

  // Interactive legend : https://bl.ocks.org/syntagmatic/ba23d525f8986cb0ebf30a5dd30c9dd2
  legend
    .on('mouseover', function (type) {
      d3.selectAll('.legend-label').style('opacity', 0.5)
      d3.select(this).style('opacity', 1)
      d3.selectAll('.dot')
        .style('opacity', 0.0)
        .filter((d) => (type === true ? d.Doping !== '' : d.Doping === ''))
        .style('opacity', 1)
    })
    .on('mouseleave', () => {
      d3.selectAll('.legend-label').style('opacity', 1)
      d3.selectAll('.dot').style('opacity', 1)
    })
}

const main = async () => {
  try {
    const data = await d3.json(DATASET_URL)
    render(data)
  } catch (err) {
    throw new Error(err.message)
  }
}

main()
