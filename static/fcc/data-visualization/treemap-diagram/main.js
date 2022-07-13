const DATASET_URL =
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json'

const render = (data) => {
  const width = 1300
  const height = 700

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

  const color = d3.scaleOrdinal(d3.schemeDark2)
  const treemap = d3.treemap().size([width, height]).paddingInner(1)
  const root = d3
    .hierarchy(data)
    .sum((d) => d.value)
    .sort((a, b) => b.value - a.value)

  treemap(root)

  const cell = svg
    .selectAll('g')
    .data(root.leaves())
    .enter()
    .append('g')
    .attr('transform', (d) => `translate(${d.x0}, ${d.y0})`)
    .on('mouseover', (d) => {
      const { name, category, value } = d.data

      tooltip.transition().style('opacity', 1)
      tooltip
        .text(
          `${name} (${category} / ${value.replace(
            // Put commas
            /\B(?=(\d{3})+(?!\d))/g,
            ','
          )})`
        )
        .attr('data-value', value)
        .style('left', `${d3.event.pageX + 10}px`)
        .style('top', `${d3.event.pageY - 20}px`)
    })
    .on('mouseout', () => {
      tooltip.transition().style('opacity', 0)
    })

  cell
    .append('rect')
    .attr('class', 'tile')
    .attr('data-name', (d) => d.data.name)
    .attr('data-category', (d) => d.data.category)
    .attr('data-value', (d) => d.data.value)
    .attr('width', (d) => d.x1 - d.x0)
    .attr('height', (d) => d.y1 - d.y0)
    .attr('fill', (d) => color(d.data.category))

  cell
    .append('text')
    .selectAll('tspan')
    .data((d) => d.data.name.split(/(?=[A-Z][^A-Z])/g))
    .enter()
    .append('tspan')
    .attr('x', 3)
    .attr('y', (d, i) => 15 + i * 15)
    .attr('font-size', '13px')
    .text((d) => d)

  const categories = root
    .leaves()
    .map((node) => node.data.category)
    .filter((category, index, self) => self.indexOf(category) === index)

  // Legend
  const boxWidth = 14

  const legend = d3
    .select('#chart')
    .append('svg')
    .attr('id', 'legend')
    .attr('transform', 'translate(0, -575)')
    .attr('width', 150)
    .attr('height', (boxWidth + 5) * categories.length)

  legend
    .selectAll('rect')
    .data(categories)
    .enter()
    .append('rect')
    .attr('class', 'legend-item')
    .attr('fill', (d) => color(d))
    .attr('x', boxWidth / 2)
    .attr('y', (d, i) => i * (boxWidth + 3) + 10)
    .attr('width', boxWidth)
    .attr('height', boxWidth)

  legend
    .append('g')
    .selectAll('text')
    .data(categories)
    .enter()
    .append('text')
    .attr('fill', 'black')
    .attr('x', boxWidth * 2)
    .attr('y', (_, i) => i * (boxWidth + 3) + 24)
    .text((d) => d)
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
