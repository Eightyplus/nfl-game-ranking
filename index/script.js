/**
 * Reactive Ranking class to render matchups for a week
 */
class Rankings extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      rankings: [],
    }
  }

  getRanking(){
    return fetch('/ranking')
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
      (rankings) => {
        this.setState({rankings: rankings});
      }
    );
  }

  render() {
    console.log(this.state.rankings);

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

    return (
      <div className="table">{rankings}</div>
    );
  }
}

ReactDOM.render(<Rankings />, document.getElementById('root'));