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
    let week = QueryString.week;
    let year = QueryString.year || new Date().getFullYear();
    let url = '/ranking?year=' + year + ( typeof week === 'undefined' ? '' : '&week=' + week);

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

    return (
      <div>
        <div className="table">
          <div className="h1">{title}</div>
          {rankings}
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Rankings />, document.getElementById('root'));