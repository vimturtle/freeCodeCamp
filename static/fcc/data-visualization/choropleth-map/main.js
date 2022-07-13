const US_EDUCATION_DATESET_URL =
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json'
const US_COUNTY_DATASET_URL =
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json'

const render = (educationData, countyData) => {
  const width = 1000
  const height = 600
  const margin = { top: 60, right: 60, bottom: 20, left: 60 }
  const innerWidth = width - margin.left - margin.right

  const minPerc = Math.min(...educationData.map((o) => o.bachelorsOrHigher))
  const maxPerc = Math.max(...educationData.map((o) => o.bachelorsOrHigher))

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

  // Legend
  const xScale = d3
    .scaleLinear()
    .domain([minPerc, maxPerc])
    .rangeRound([500, innerWidth])

  const colors = d3
    .scaleThreshold()
    .domain(d3.range(minPerc, maxPerc, (maxPerc - minPerc) / 9))
    .range(d3.schemeOranges[9])

  const g = svg
    .append('g')
    .attr('id', 'legend')
    .attr('transform', 'translate(0, 20)')

  g.selectAll('rect')
    .data(
      colors.range().map((d) => {
        d = colors.invertExtent(d)
        if (d[0] === null) {
          d[0] = xScale.domain()[0]
        }
        if (d[1] === null) {
          d[1] = xScale.domain()[1]
        }
        return d
      })
    )
    .enter()
    .append('rect')
    .attr('height', 8)
    .attr('x', (d) => {
      return xScale(d[0])
    })
    .attr('width', (d) => {
      return d[0] && d[1] ? xScale(d[1]) - xScale(d[0]) : xScale(null)
    })
    .attr('fill', (d) => {
      return colors(d[0])
    })
    .on('mouseover', function (type) {
      console.log(type)
      d3.selectAll('.county')
        .style('opacity', 0.1)
        .filter(
          (d) =>
            colors(
              educationData.find((item) => item.fips === d.id).bachelorsOrHigher
            ) === colors(type[0])
        )
        .style('opacity', 1)
    })
    .on('mouseleave', () => {
      d3.selectAll('.county').style('opacity', 1)
    })

  g.call(
    d3
      .axisBottom(xScale)
      .tickSize(13)
      .tickFormat((x) => {
        return Math.round(x) + '%'
      })
      .tickValues(colors.domain())
  )
    .select('.domain')
    .remove()

  // Enter data
  svg
    .selectAll('path')
    .data(countyData)
    .enter()
    .append('path')
    .attr('d', d3.geoPath())
    .attr('class', 'county')
    .attr(
      'fill',
      (d) =>
        colors(
          educationData.find((item) => item.fips === d.id).bachelorsOrHigher
        ) || colors(0)
    )
    .attr('data-fips', (d) => {
      return d.id
    })
    .attr(
      'data-education',
      (d) => educationData.find((item) => item.fips === d.id).bachelorsOrHigher
    )
    .on('mouseover', (d) => {
      d3.select(d3.event.currentTarget).style('fill', 'green')
      let { area_name, state, bachelorsOrHigher } = educationData.find(
        (item) => item.fips === d.id
      )

      tooltip.transition().style('opacity', '1')
      tooltip
        .text(`${area_name}, ${state} (${bachelorsOrHigher}%)`)
        .attr('data-education', bachelorsOrHigher)
        .style('left', `${d3.event.pageX + 10}px`)
        .style('top', `${d3.event.pageY - 20}px`)
    })
    .on('mouseout', (d) => {
      tooltip.transition().style('opacity', '0')
      d3.select(d3.event.currentTarget).style(
        'fill',
        colors(d.bachelorsOrHigher)
      )
    })
}

const main = async () => {
  try {
    const educationData = await d3.json(US_EDUCATION_DATESET_URL)
    const countyData = await d3.json(US_COUNTY_DATASET_URL)
    render(
      educationData,
      topojson.feature(countyData, countyData.objects.counties).features
    )
  } catch (err) {
    throw new Error(err.message)
  }
}

main()
