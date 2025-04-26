const backendBaseURL = "https://deadlock-simulator-backend.onrender.com";

// Function to run the Banker's Algorithm simulation
async function runSimulation() {
  const payload = {
    available: [3, 3, 2],
    max: [
      [7, 5, 3],
      [3, 2, 2],
      [9, 0, 2],
      [2, 2, 2],
      [4, 3, 3],
    ],
    allocation: [
      [0, 1, 0],
      [2, 0, 0],
      [3, 0, 2],
      [2, 1, 1],
      [0, 0, 2],
    ],
  };

  try {
    const res = await fetch(`${backendBaseURL}/api/bankers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error("Failed to fetch from backend");
    }

    const data = await res.json();
    document.getElementById("result").innerHTML = data.safe
      ? `<h4 class='text-success'>Safe State</h4><p>Safe Sequence: ${data.sequence.join(
          " → "
        )}</p>`
      : `<h4 class='text-danger'>Deadlock Detected</h4>`;

    drawGraph();
  } catch (error) {
    console.error("Error running simulation:", error);
    document.getElementById("result").innerHTML = `<h4 class='text-danger'>Error: ${error.message}</h4>`;
  }
}

// Function to draw the graph
function drawGraph() {
  const nodes = [
    { id: "P0" },
    { id: "P1" },
    { id: "P2" },
    { id: "R0" },
    { id: "R1" },
  ];
  const links = [
    { source: "P0", target: "R0" },
    { source: "R0", target: "P1" },
    { source: "P1", target: "R1" },
    { source: "R1", target: "P0" },
  ];

  const svg = d3
    .select("#graph-container")
    .html("")
    .append("svg")
    .attr("width", 600)
    .attr("height", 400);

  const simulation = d3
    .forceSimulation(nodes)
    .force("link", d3.forceLink(links).id((d) => d.id).distance(100))
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(300, 200));

  const link = svg
    .append("g")
    .selectAll("line")
    .data(links)
    .enter()
    .append("line")
    .attr("stroke", "#999");

  const node = svg
    .append("g")
    .selectAll("circle")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("r", 15)
    .attr("fill", (d) => (d.id.startsWith("P") ? "orange" : "skyblue"))
    .call(drag(simulation));

  const label = svg
    .append("g")
    .selectAll("text")
    .data(nodes)
    .enter()
    .append("text")
    .text((d) => d.id)
    .attr("font-size", "12px")
    .attr("dx", 15)
    .attr("dy", ".35em");

  simulation.on("tick", () => {
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);
    node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
    label.attr("x", (d) => d.x).attr("y", (d) => d.y);
  });

  function drag(simulation) {
    return d3
      .drag()
      .on("start", (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });
  }
}

// Test the backend connection with a GET request
fetch(`${backendBaseURL}/api/endpoint`, { method: "GET" })
  .then((response) => {
    if (!response.ok) {
      throw new Error("Failed to fetch backend endpoint");
    }
    return response.json();
  })
  .then((data) => console.log("Backend test response:", data))
  .catch((error) => console.error("Error testing backend connection:", error));