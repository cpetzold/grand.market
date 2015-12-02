import React from 'react';
import Relay from 'react-relay';
import _ from 'lodash';

class App extends React.Component {
  state = {
    types: {
      ACTION: true,
      REACTION: true,
      DURATION: true,
      RESERVE: true,
      EVENT: true,

      ATTACK: true,
      KNIGHT: true,
      PRIZE: true,
      TRAVELLER: true,

      SHELTER: true,
      RUINS: true,

      TREASURE: true,
      VICTORY: true,
      CURSE: true,
    }
  }

  onTypeToggle = (type, e) => {
    this.setState(({types}) => {
      types[type] = !types[type];
      return {types};
    });
  }

  renderTypeToggle = ([type, active]) => {
    return (
      <label
        key={type}
        style={{display: 'inline-block', marginRight: 10}}>
        <input
          type='checkbox'
          checked={active}
          onChange={this.onTypeToggle.bind(this, type)} />
        {_.startCase(type.toLowerCase())}
      </label>
    );
  }

  filterCards = (cards) => {
    const {types} = this.state;
    return cards.filter(card => _.some(card.types, type => types[type]));
  }

  render() {
    const {cards} = this.props.viewer;
    const {types} = this.state;

    const displayedCards = _.sortBy(this.filterCards(cards), c => c.name);

    return (
      <div>
        <div>
          <strong>Types: </strong>
          {_.pairs(types).map(this.renderTypeToggle)}
        </div>
        <ul style={{
          padding: 0,
          listStyle: 'none'
        }}>
          {displayedCards.map(card =>
            <li style={{display: 'inline-block', width: '12.5%'}} key={card.id}><img style={{width: '100%'}} src={`images/${card.image}`} /></li>
          )}
        </ul>
      </div>
    );
  }
}

export default Relay.createContainer(App, {
  fragments: {
    viewer: () => Relay.QL`
      fragment on User {
        cards {
          id
          image
          types
        }
      }
    `,
  },
});
