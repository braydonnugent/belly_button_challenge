
//Object Separation----------------------------------------------------
const data = d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json")
  .then(data => {
    console.log(data);

    const names = data.names;
    console.log('names', names);

    const metadata = data.metadata;
    console.log('metadata', metadata);

    const samples = data.samples;
    console.log('samples', samples);

    return { names, metadata, samples };
  })
  .catch(error => {
    console.error("Error loading the data:", error);
  });

(async () => {
  const { names, metadata, samples } = await data; //Note, this await function was necessary as JavaScript would continue to read the code before the objects had been prepared which would result in the rest of the variables/constants not generating properly.

//Identifying & logging web components for interaction and visualisation-------------------------------------------------

  const idSelector = document.getElementById('selDataset');
  console.log(idSelector);

//Creating dropdown list for idSelector-------------------------------------------------

  names.forEach(name => {
    idSelector.add(new Option(name, name));
  });

  idSelector.addEventListener('change', function () {
    const selectedName = this.value;
    console.log('Selected name:', selectedName);
  });

  const metadataSample = document.getElementById('sample-metadata');
  console.log(metadataSample);

//Implementing additional event listner to present relevant metadata information to selectedMetadata-------------------------------------------------

  idSelector.addEventListener('input', function () {
    const selectedName = this.value;

    let selectedMetadata;

    for (let i = 0; i < names.length; i++) {
      if (selectedName === names[i]) {
        selectedMetadata = metadata[i];
        break;
      }
    }

//Implementing selectedMetadata reset to ensure the previous metadata is cleared before placing new metadata------------------------------------------------------
    if (selectedMetadata) {
      metadataSample.innerHTML = '';

      const ul = document.createElement('ul');
      for (const key in selectedMetadata) {
        const li = document.createElement('li');
        li.textContent = `${key}: ${selectedMetadata[key]}`;
        ul.appendChild(li);
      }

      metadataSample.appendChild(ul);
    } else {
      metadataSample.textContent = "No metadata found for the selected name.";
    }
  });

  //Plotting horizontal bar chart-----------------------------------------------------

  idSelector.addEventListener('input', function () {
    const selectedName = this.value;
  
    let selectedSampleData;
  
    for (let i = 0; i < names.length; i++) {
      if (selectedName === names[i]) {
        selectedSampleData = samples[i];
        break;
      }
    }
  
    console.log("selected sample data", selectedSampleData);
  
    let sample_values = selectedSampleData.sample_values.slice(0, 10).reverse();
    let otu_ids = selectedSampleData.otu_ids.slice(0, 10).reverse().map(id => `OTU ${id}`);
    let otu_labels = selectedSampleData.otu_labels.slice(0, 10).reverse();
    let title = "Top 10 OTUs";
  
    console.log("sample values", sample_values);
    console.log("otu_ids", otu_ids);
  
    const plotDiv = document.createElement('div');
    plotDiv.id = 'plot';
  
    document.body.appendChild(plotDiv);
  
    let trace1 = {
      x: sample_values,
      y: otu_ids,
      type: 'bar',
      orientation: 'h',
      text: otu_labels
    };
  
    let chartData = [trace1];
  
    let layout = {
      title: title
    };
  
    Plotly.newPlot("plot", chartData, layout);
  
    //Plotting bubble chart-----------------------------------------------------
    
    const bubbleChartDiv = document.createElement('div');
    bubbleChartDiv.id = 'bubble-chart';
    
    document.body.appendChild(bubbleChartDiv);
  
    let trace2 = {
      x: selectedSampleData.otu_ids,
      y: selectedSampleData.sample_values,
      mode: 'markers',
      marker: {
        size: selectedSampleData.sample_values,
        color: selectedSampleData.otu_ids,
        colorscale: 'Viridis'
      },
      text: selectedSampleData.otu_labels
    };
  
    let chartData2 = [trace2];
  
    let layout2 = {
      title: 'Bubble Chart',
      showlegend: false,
      xaxis: { title: 'OTU IDs' },
      yaxis: { title: 'Sample Values' }
    };
  
    Plotly.newPlot("bubble-chart", chartData2, layout2);
    
  });
})();
