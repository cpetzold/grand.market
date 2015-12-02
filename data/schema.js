import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLEnumType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
} from 'graphql-relay';

import cards from './cards';

const {nodeInterface, nodeField} = nodeDefinitions(
  (globalId) => {
    const {type, id} = fromGlobalId(globalId);
    if (type === 'Card') {
      return cards[id];
    } else {
      return null;
    }
  },
  (obj) => Card
);

function propertyField(type, prop) {
  return {
    type,
    resolve: (obj) => obj[prop]
  };
}

const CardSet = new GraphQLEnumType({
  name: 'CardSet',
  values: {
    BASE: { value: 'base' },
    INTRIGUE: { value: 'intrigue' },
    SEASIDE: { value: 'seaside' },
    ALCHEMY: { value: 'alchemy' },
    PROSPERITY: { value: 'prosperity' },
    CORNUCOPIA: { value: 'cornucopia' },
    HINTERLANDS: { value: 'hinterlands' },
    DARK_AGES: { value: 'dark ages' },
    GUILDS: { value: 'guilds' },
    ADVENTURES: { value: 'adventures' },
    PROMO: { value: 'promo' },
    BASE_CARDS: { value: 'base cards' },
    COMMON: { value: 'common' },
  }
});

const CardType = new GraphQLEnumType({
  name: 'CardType',
  values: {
    ACTION:     { value: 'action' },
    REACTION:   { value: 'reaction' },
    DURATION:   { value: 'duration' },
    RESERVE:    { value: 'reserve' },
    EVENT:      { value: 'event' },

    ATTACK:     { value: 'attack' },
    KNIGHT:     { value: 'knight' },
    PRIZE:      { value: 'prize' },
    TRAVELLER:  { value: 'traveller' },

    SHELTER:    { value: 'shelter' },
    RUINS:      { value: 'ruins' },

    TREASURE:   { value: 'treasure' },
    VICTORY:    { value: 'victory' },
    CURSE:      { value: 'curse' },
  }
});

const Card = new GraphQLObjectType({
  name: 'Card',
  fields: () => ({
    id: globalIdField('Card'),
    name: propertyField(GraphQLString, 'name'),
    set: propertyField(CardSet, 'set'),
    types: propertyField(new GraphQLList(CardType), 'types'),
    image: propertyField(GraphQLString, 'image'),
    rules: propertyField(GraphQLString, 'rules'),
    coinCost: propertyField(GraphQLInt, 'coinCost'),
    potionCost: propertyField(GraphQLInt, 'potionCost'),
  }),
  interfaces: [nodeInterface],
});

const User = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    cards: {
      type: new GraphQLList(Card),
      resolve: ({cards}) => {
        return cards.map((card, i) => {
          card.id = i;
          return card;
        });
      }
    }
  })
});

export default new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: () => ({
      node: nodeField,
      viewer: {
        type: User,
        resolve: () => ({ cards })
      }
    })
  }),
});
