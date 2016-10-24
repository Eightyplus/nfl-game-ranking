class Arrow extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    var url = '/?week=' + this.props.week;
    var arrow = (this.props.directionLeft) ? '<' : '>';

    return (
      <div className="arrow">
        <a href={url}>{arrow}</a>
      </div>
    );
  }
}

/**
 * Reactive Ranking class to render matchups for a week
 */
class Rankings extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      week: undefined,
      rankings: [],
      unplayed: []
    }
  }

  getRanking(){
    var week = QueryString.week;
    var year = QueryString.year || new Date().getFullYear();
    var url = '/ranking?year=' + year + ( typeof week === 'undefined' ? '' : '&week=' + week);

    return fetch(url)
      .then( (response) => {
        return response.json()
      })
      .then( (json) => {
        return json;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  componentWillMount() {
    this.getRanking().then(
      (data) => {
        this.setState({
            week: data.week,
            year: data.year || new Date().getFullYear(),
            rankings: data.rankings,
            unplayed: data.unplayed
          }
        );
      }
    );
  }

  renderRanking(rank, index) {
    return <div className="row" key={index}>
      <div className="away">
        <img src={rank.away_logo || rank.away.logo}/>
      </div>

      <div className="home">
        <img src={rank.home_logo || rank.home.logo}/>
      </div>
    </div>
  }

  renderBottom() {
    var uplayed = this.state.unplayed.map(this.renderRanking);

    return (
      <div className="unplayed">Unplayed
        <div className="table">
          {uplayed}
        </div>
      </div>
    );
  }

  render() {
    if (this.state.rankings) {
      console.log('Ranking');
      console.log(this.state.rankings);
    }

    var title = this.state.week ? this.state.year + ', Week ' + this.state.week : '';
    var rankings = this.state.rankings.map(this.renderRanking);
    var weekNumber = getWeekNumber()[1] - 36;
    var previous = this.state.week > 1 ? <Arrow directionLeft={true} week={this.state.week - 1}/> : '';
    var next = this.state.week < weekNumber ? <Arrow directionLeft={false} week={parseInt(this.state.week) + 1}/> : '';
    var bottom = this.state.unplayed ? this.renderBottom() : '';

    return (
      <div className="container">
        {previous}
        <div>
          <div className="header">{title}</div>
          <div className="table">
            {rankings}
          </div>
          {bottom}
        </div>
        {next}
      </div>
    );
  }
}

ReactDOM.render(<Rankings />, document.getElementById('root'));