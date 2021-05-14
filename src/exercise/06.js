// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {ErrorBoundary} from 'react-error-boundary'
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'

const ErrorFallback = ({error, resetErrorBoundary}) => {
  return (
    <div role="alert">
      There was an error:{' '}
      <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      <button onClick={() => resetErrorBoundary()}>Try again</button>
    </div>
  )
}

function PokemonInfo({pokemonName}) {
  const statuses = React.useMemo(
    () => ({
      IDLE: 'idle',
      PENDING: 'pending',
      RESOLVED: 'resolved',
      REJECTED: 'rejected',
    }),
    [],
  )

  const [state, setState] = React.useState({
    status: statuses.IDLE,
    pokemon: null,
    error: null,
  })
  const {status, pokemon, error} = state

  React.useEffect(() => {
    if (!pokemonName) {
      return
    }

    setState({status: statuses.PENDING})

    fetchPokemon(pokemonName)
      .then(pokemonData => {
        setState({status: statuses.RESOLVED, pokemon: pokemonData})
      })
      .catch(error => {
        setState({status: statuses.REJECTED, error})
      })
  }, [pokemonName, statuses])

  if (status === statuses.REJECTED) {
    throw error
  } else if (status === statuses.IDLE) {
    return 'Submit a pokemon'
  } else if (status === statuses.PENDING) {
    return <PokemonInfoFallback name={pokemonName} />
  } else {
    return <PokemonDataView pokemon={pokemon} />
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={() => setPokemonName('')}
          resetKeys={[pokemonName]}
        >
          <PokemonInfo pokemonName={pokemonName} />
        </ErrorBoundary>
      </div>
    </div>
  )
}

export default App
