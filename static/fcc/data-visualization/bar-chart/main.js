const DATASET_URL =
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'

const render = (data) => {
  const width = 1000
  const height = 600
  const margin = { top: 60, right: 60, bottom: 20, left: 60 }
  const innerWidth = width - margin.left - margin.right
  const innerHeight = height - margin.top - margin.bottom
  const barWidth = width / data.length

  // SVG
  const svg = d3
    .select('#chart')
    .append('svg')
    .attr('width', width)
    .attr('height', height)

  // xAxis
  const yearsArray = data.map((item) => {
    return new Date(item[0])
  })

  const xScale = d3
    .scaleTime()
    .domain([d3.min(yearsArray), d3.max(yearsArray)])
    .range([0, innerWidth])

  const xAxis = d3.axisBottom(xScale)

  const xAxisGroup = svg
    .append('g')
    .call(xAxis)
    .attr('id', 'x-axis')
    .attr('transform', `translate(${margin.left}, ${innerHeight})`)

  // yAxis
  const GDP = data.map((item) => item[1])

  const scaleGDP = d3
    .scaleLinear()
    .domain([0, d3.max(GDP)])
    .range([0, innerHeight])

  const scaledGDP = GDP.map(function (item) {
    return scaleGDP(item)
  })

  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(GDP)])
    .range([innerHeight, 0])

  const yAxis = d3.axisLeft(yScale)

  const yAxisGroup = svg
    .append('g')
    .call(yAxis)
    .attr('id', 'y-axis')
    .attr('transform', `translate(${margin.left}, 0)`)

  // xAxis label
  svg
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('x', -400)
    .attr('y', 90)
    .text('Gross Domestic Product (in Billions) ➝')

  // yAxis label
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

  const quartersArray = data.map((date) => {
    let quarter = ''
    const year = date[0].substring(0, 4)
    const month = date[0].substring(5, 7)

    switch (month) {
      case '01':
        quarter = 'Quarter 1'
        break
      case '04':
        quarter = 'Quarter 2'
        break
      case '07':
        quarter = 'Quarter 3'
        break
      default:
        quarter = 'Quarter 4'
        break
    }

    return `${year} (${quarter})`
  })

  // Enter data
  d3.select('svg')
    .selectAll('rect')
    .data(scaledGDP)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('data-date', (d, i) => data[i][0])
    .attr('data-gdp', (d, i) => data[i][1])
    .attr('x', (d, i) => xScale(yearsArray[i]))
    .attr('y', (d) => innerHeight - d)
    .attr('width', barWidth)
    .attr('height', (d) => d)
    .style('fill', '#222')
    .attr('transform', `translate(${margin.left}, 0)`)
    .on('mouseover', function (d, i) {
      // Overlay
      d3.select(this).attr('opacity', 0.5)
      // Tooltip
      tooltip.transition().duration(250).style('opacity', 0.9)
      tooltip
        .html(quartersArray[i] + '<br>' + `$${GDP[i]} Billions`)
        .attr('data-date', data[i][0])
        .style('left', `${d3.event.pageX + 30}px`)
        .style('top', `${d3.event.pageY - 80}px`)
    })
    .on('mouseleave', function () {
      d3.select(this).attr('opacity', 1)
      tooltip.transition().duration(250).style('opacity', 0)
    })
}

const main = async () => {
  try {
    const data = await d3.json(DATASET_URL)
    render(data.data)
  } catch (err) {
    throw new Error(err.message)
  }
}

main()
