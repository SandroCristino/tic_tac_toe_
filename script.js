
const game_flow = (() => {
    const _player_one_name_input = document.getElementById('player_one_name');
    const _player_two_name_input = document.getElementById('player_two_name');
    const _playfield = document.querySelectorAll('#playfield');
    const _round_output = document.getElementById('round_output');
    const _first_window = document.getElementById('first_window');
    const _second_window = document.getElementById('second_window');
    const _reset_btn = document.getElementById('reset_btn');
    const _game_over_text = document.querySelector('.game-over')
    const _start_btn = document.getElementById('start_game_btn');
    const _player_option = document.querySelectorAll('#player_option');

    let _textfield_first_player = document.getElementById('textfield_first_player');
    let _textfield_second_player = document.getElementById('textfield_second_player');
    let _second_player_human;
    let _round = 1;
    let _gamemode_bot;


    const _Player = (name, human) => {
        this.name = name;
        this.human = human;
        score = 0;
        return {human, name, score};
    }

    let _player_one = _Player('Max', true)
    let _player_two = _Player('Paul', true )


    _player_option.forEach((item) => {
        item.addEventListener('click', () => {
            _set_player(item.name, item);
        })
    })

    function _set_player (item, object) {
        switch (item) {
            case 'second_player_human':
                _second_player_human = true;
                // Set color default
                _player_option[1].style.opacity = '1'
                _player_option[1].style.backgroundColor = 'white';

                object.style.opacity = '0.9'
                object.style.backgroundColor = 'green';
                break;
            case 'second_player_bot':
                _second_player_human = false;
                _player_option[0].style.opacity = '1'
                _player_option[0].style.backgroundColor = 'white';
                object.style.opacity = '0.9'
                object.style.backgroundColor = 'green';
                break;
            default:
                console.log('Error code 200')
        }

    }
  
    function _reset () {
        _player_one.score = 0;
        _player_two.score = 0;
        _round = 1
        _textfield_first_player.innerHTML = _player_one.name
        _textfield_second_player.innerHTML = _player_two.name
        _round_output.innerHTML = 'Round' + ' ' + _round
    }

    function _start_game () {
        
        _player_one.name = _player_one_name_input.value
        _player_two.name = _player_two_name_input.value
        _player_two.human = _second_player_human

        if (_second_player_human !== undefined) {
            _first_window.setAttribute('style', 'visibility: hidden');
            _second_window.setAttribute('style', 'visibility: visible');
        } else {
            alert('Choose player mode')
        }

        // Set bot gamemode
        _player_two.human == true ? _gamemode_bot = false : _gamemode_bot = true;

        // If name input empty
        if (_player_one_name_input.value == '') {_player_one.name = 'Sandy'}
        if (_player_two_name_input.value == '') {_player_two.name = 'Wezzy'}
        

        _reset()

    }


    _start_btn.addEventListener('click', () => {
        _start_game();
    }); 

    const game = {
        xTurn: true,
        xState: [],
        oState: [],
        winningStates: [
            // Rows
            ['0', '1', '2'],
            ['3', '4', '5'],
            ['6', '7', '8'],
    
            // Columns
            ['0', '3', '6'],
            ['1', '4', '7'],
            ['2', '5', '8'],
    
            // Diagonal
            ['0', '4', '8'],
            ['2', '4', '6']
        ]
    }

    document.addEventListener('click', event => {
        
        const target = event.target
        const isCell = target.classList.contains('grid-cell')
        const isDisabled = target.classList.contains('disabled')
    
        // Defaul name reset btn
        if (_reset_btn.innerHTML == 'Reset') {

            if (isCell && !isDisabled) {


                // Common click settings
                const cellValue = target.dataset.value
                if (game.xTurn) {
                    game.xState.push(cellValue) 
                    target.innerHTML = '❌'
                } else if (!_gamemode_bot) {
                    game.oState.push(cellValue)
                    target.innerHTML = '⭕️'
                }
                
                target.classList.add('disabled')
                target.classList.add(game.xTurn ? 'x' : 'o')
                
                // Simple botmode
                if (_gamemode_bot) {
                    let check = false;
                    let random;
                    while (!check) {
                        random = Math.floor(Math.random() * 9)
                        const isDisabled2 = _playfield[random].classList.contains('disabled')

                        if (!isDisabled2) {
                            console.log(_playfield[random].classList.contains)
                            check = true;
                        }
                    }
                    console.log(_playfield[random])
                    game.oState.push(cellValue)
                    _playfield[random].innerHTML = '⭕️'
                    game.xTurn = !game.xTurn
                }
                game.xTurn = !game.xTurn
            }

            // Check draw
            if (!document.querySelectorAll('.grid-cell:not(.disabled)').length) {
                _reset_btn.innerHTML = 'New game'
                _game_over_text.setAttribute('style', 'visibility: visible');
                _game_over_text.textContent = 'Draw!'
            }

            // Check wins
            game.winningStates.forEach(winningState => {
                const xWins = winningState.every(state => game.xState.includes(state))
                const oWins = winningState.every(state => game.oState.includes(state))
            
                if (xWins || oWins) {
                    _playfield.forEach(cell => cell.classList.add('disabled'))
                    _reset_btn.innerHTML = 'New game'
                    _game_over_text.setAttribute('style', 'visibility: visible')
                    _game_over_text.textContent = xWins
                        ? `${_player_one.name} wins` 
                        : `${_player_two.name} wins`
                    
                    if (xWins) {
                        _update_states(_player_one, _textfield_first_player);
                    } else {
                        _update_states(_player_two, _textfield_second_player);
                    }
                }
            })
        }

   
    })

    // Restart game
    _reset_btn.addEventListener('click', () => {
        _game_over_text.setAttribute('style', 'visibility: hidden');
        _playfield.forEach(cell => {
            cell.classList.remove('disabled', 'x', 'o')
            cell.innerHTML = ''
        })

        game.xTurn = true
        game.xState = []
        game.oState = []
        
        if (_reset_btn.innerHTML == 'Reset') {_reset()}
        _reset_btn.innerHTML = 'Reset'
    })
  
    function _update_states (player, textfield) {
        player.score++;
        _round++;
        textfield.innerHTML = player.name + ' ' + player.score
        _round_output.innerHTML = 'Round' + ' ' + _round
    }

})();
