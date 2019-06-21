import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import web3 from './web3';
import lottery from './lottery';

class App extends Component {

  // Forma antigua

  /*constructor(props) {
    super(props);

    this.state = { manager : '' };
  }*/

  // Forma nueva: automáticamente en el constructor

  state = {
    manager: '',
    players: [],
    balance: ''
  }

  async componentDidMount(){
    const manager = await lottery.methods.manager().call(); // usando Metamask no hace falta especificar un from
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);

    this.setState({ 
      manager: manager, 
      players: players,
      balance: balance,
      value: '',
      message: ''
    });
  }

  onSubmit = async (event) => { // no nos preocupamos del binding
    event.preventDefault();

    // cuando enviamos, tenemos que especificar address

    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'La transacción puede tardar unos segundos...' });

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    });

    this.setState({ message: '¡Has entrado!' });
  };

  onClick = async () => {

    const accounts = await web3.eth.getAccounts();

    this.setState({ message: 'La transacción puede tardar unos segundos...' })

    await lottery.methods.pickWinner().send({
      from: accounts[0]
    });

    this.setState({ message: '¡Ya tenemos un ganador!'});

    // Si queremos decir qué address ha ganado
    
    /* const lastWinner = await lottery.methods.pickWinner().call().lastWinner;

    this.setState({ message: '¡Y el ganador es: ' + lastWinner}); */

  }

  render() {
    
    return (
      <div>
        <h2>Contrato de Lotería</h2>
        <p>Este contrato ha sido creado por: {this.state.manager}</p>
        <p>¡Actualmente hay {this.state.players.length} jugadores compitiendo
        por {web3.utils.fromWei(this.state.balance, 'ether')} ether!</p>
        <hr />

        <form onSubmit={this.onSubmit}>
          <h4>¿Quieres probar suerte?</h4>
          <div>
            <label>Cantidad de ether: </label>
            <input
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
            />
          </div>
          <button>Enviar</button>
        </form>

        <hr />

        <h4>¡Tira los dados y descubre al ganador!</h4>
        <button onClick={this.onClick}>Lanzar</button>

        <hr />

        <h1>{this.state.message}</h1>
      </div>
    );  
  }
}

export default App;
