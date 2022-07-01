const P = new Pokedex.Pokedex();

let berriesArray;

class BerriesApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedBerry: null,
      selectedBerryIndex: null
    };
    this.selectBerryTile = this.selectBerryTile.bind(this);
    this.selectNone = this.selectNone.bind(this);
  }

  selectBerryTile(event) {
    this.setState((state) => {
      if (state.selectedBerry == event.target.dataset.berry) {
        return {
          selectedBerry: null,
          selectedBerryIndex: null
        };
      } else {
        return {
          selectedBerry: event.target.dataset.berry,
          selectedBerryIndex: event.target.dataset.berryIndex
        };
      }
    });
  }

  selectNone(event) {
    if (event.target.id == "berries-list") {
      this.setState({
        selectedBerry: null,
        selectedBerryIndex: null
      });
    }
  }

  render() {
    if (!this.props.berriesArray) {
      return (
        <div className="spinner-box">
          <div className="circle-border">
            <div className="circle-core"></div>
          </div>
        </div>
      );
    }

    return (
      <div
        style={{
          display: "flex",
          flexDirection: document.body.clientWidth <= 800 ? "column" : "row",
          width: "100%",
          maxWidth: "70rem",
          margin: "0 auto"
        }}
      >
        <BerriesList
          berriesArray={this.props.berriesArray}
          selectedBerry={this.state.selectedBerry}
          selectBerryTile={this.selectBerryTile}
          selectNone={this.selectNone}
        />
        <BerryDetails
          berry={
            this.state.selectedBerryIndex
              ? this.props.berriesArray[this.state.selectedBerryIndex]
              : null
          }
        />
      </div>
    );
  }
}

class BerriesList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div
        style={{
          width: document.body.clientWidth <= 800 ? "100%" : "60%",
          height: "min-content",
          padding: "1rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(6rem, 1fr))",
          gridAutoRows: "min-content",
          gap: 10
        }}
        onClick={this.props.selectNone}
        id="berries-list"
      >
        {this.props.berriesArray.map((berry, index) => (
          <BerryTile
            key={index}
            berryName={berry.name}
            berryIndex={index}
            berryImageSrc={berry.imageSrc}
            selected={this.props.selectedBerry == berry.name ? true : false}
            selectBerryTile={this.props.selectBerryTile}
          />
        ))}
      </div>
    );
  }
}

class BerryTile extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div
        className={"berry-tile" + (this.props.selected ? " selected" : "")}
        onClick={this.props.selectBerryTile}
        data-berry={this.props.berryName}
        data-berry-index={this.props.berryIndex}
      >
        <figure
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            margin: ".5rem"
          }}
        >
          <img src={this.props.berryImageSrc} alt="kelpsy image" />
          <figcaption>{this.props.berryName}</figcaption>
        </figure>
      </div>
    );
  }
}

class BerryDetails extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const sectionStyle = {
      margin: "1rem 0",
      padding: "0 1rem"
    };
    if (!this.props.berry) {
      return (
        <div
          style={{
            ...sectionStyle,
            width: document.body.clientWidth <= 800 ? "100%" : "40%"
          }}
        >
          No berry selected
        </div>
      );
    } else {
      const data = {
        labels: this.props.berry.details.flavors.map(
          (flavor) => flavor.flavor.name
        ),
        datasets: [
          {
            label: "Potency",
            data: this.props.berry.details.flavors.map(
              (flavor) => flavor.potency
            ),
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderColor: "rgba(255, 99, 132, 1)"
          }
        ]
      };
      const options = {
        scales: {
          r: {
            suggestedMax: 50
          }
        },
        elements: {
          line: {
            borderWidth: 3
          }
        }
      };

      return (
        <div
          style={{ width: document.body.clientWidth <= 800 ? "100%" : "40%" }}
        >
          <section style={sectionStyle}>
            <h2 style={{ fontSize: "1rem", margin: 0 }}>Effect</h2>
            <span>{this.props.berry.effect}</span>
          </section>
          <section style={sectionStyle}>
            <h2
              style={{
                fontSize: "1rem",
                display: "inline",
                marginRight: "1rem"
              }}
            >
              Firmness
            </h2>
            <span
              className={"firmness " + this.props.berry.details.firmness.name}
            >
              {this.props.berry.details.firmness.name}
            </span>
          </section>
          <section style={sectionStyle}>
            <h2
              style={{
                fontSize: "1rem",
                display: "inline",
                marginRight: "1rem"
              }}
            >
              Size
            </h2>
            <span>{this.props.berry.details.size}</span>
          </section>
          <section style={sectionStyle}>
            <h2 style={{ fontSize: "1rem", margin: 0 }}>Flavors</h2>
            <Radar data={data} options={options} />
          </section>
        </div>
      );
    }
  }
}

class Radar extends React.Component {
  constructor(props) {
    super(props);
    this.chartRef = React.createRef();
    this.chart = null;
  }

  componentDidMount() {
    const myChartRef = this.chartRef.current.getContext("2d");

    this.chart = new Chart(myChartRef, {
      type: "radar",
      data: this.props.data,
      options: this.props.options
    });
  }

  componentDidUpdate() {
    this.chart.data = this.props.data;
    this.chart.update();
  }

  render() {
    return (
      <div style={{ margin: 0, padding: 0, width: "300px" }}>
        <canvas id="myChart" ref={this.chartRef} />
      </div>
    );
  }
}

renderAll();

P.getBerriesList().then((berriesList) => {
  berriesArray = berriesList.results.map((berry) => berry.name);
  const berriesDetailsPromises = berriesArray.map((berryName) =>
    P.getBerryByName(berryName)
  );
  getBerriesItems(berriesDetailsPromises);
});

function getBerriesItems(berriesDetailsPromises) {
  Promise.all(berriesDetailsPromises).then((berriesDetails) => {
    berriesArray = berriesArray.map((element, index) => ({
      name: element,
      details: berriesDetails[index]
    }));
    const berriesItemsPromises = berriesDetails.map((berryDetails) =>
      P.getItemByName(berryDetails.item.name)
    );
    getBerriesImagesSrcs(berriesItemsPromises);
  });
}

function getBerriesImagesSrcs(berriesItemsPromises) {
  Promise.all(berriesItemsPromises).then((berriesItems) => {
    berriesArray = berriesArray.map((element, index) => ({
      ...element,
      effect: berriesItems[index].effect_entries[0].short_effect,
      imageSrc: berriesItems[index].sprites.default
    }));
    renderAll();
  });
}

function renderAll() {
  ReactDOM.render(
    <BerriesApp berriesArray={berriesArray} />,
    document.body
  );
}
