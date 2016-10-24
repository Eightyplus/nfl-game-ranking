class Arrow extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    var url = '/?week=' + this.props.week;
    var arrow = (this.props.directionLeft) ? '<' : '>';

    return (
      <a className="arrow" href={url}>{arrow}</a>
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
            rankings: data.rankings
          }
        );
      }
    );
  }

  render() {
    if (this.state.rankings) {
      console.log('Ranking');
      console.log(this.state.rankings);
    }

    var rankings = this.state.rankings.map(function (rank, index) {
      return <div className="row" key={index}>
        <div className="away">
          <img src={rank.away_logo}/>
        </div>

        <div className="home">
          <img src={rank.home_logo}/>
        </div>
      </div>
    });

    var title = this.state.week ? this.state.year + ', Week ' + this.state.week : '';

    var weekNumber = getWeekNumber()[1] - 36;
    var previous =  <Arrow directionLeft={true} week={this.state.week - 1}/>;
    var next = this.state.week < weekNumber ? <Arrow directionLeft={false} week={parseInt(this.state.week) + 1}/> : '';

    return (
      <div className="container">
        {previous}
        <div>
          <div className="header">{title}</div>
          <div className="table">
            {rankings}
          </div>
        </div>
        {next}
      </div>
    );
  }
}

ReactDOM.render(<Rankings />, document.getElementById('root'));