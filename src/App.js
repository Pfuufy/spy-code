import React from 'react';
import './App.css';
import * as esprima from 'esprima';

function Title() {
    return <h1>Spy Code!</h1>;
}

class CodeForm extends React.Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.keyDown = this.keyDown.bind(this);
    }

    handleChange(e) {
        this.props.handleChange(e);

    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.handleSubmit();
    }

    keyDown(e) {
        if (e.keyCode === 9 || e.which === 9) {
            this.tabKey(e);
        }
    }

    tabKey(e) {
        e.preventDefault();
        const text = document.getElementById('code');
        const start = text.selectionStart;
        const end = text.selectionEnd;
        const value = text.value;
        text.value = value.substring(0, start) + '\t' + value.substring(end);
        text.selectionEnd = start + 1;
    }

    render() {
        return (
            <form
                onSubmit={this.handleSubmit}
            >
                <textarea
                    name="code"
                    id="code"
                    value={this.props.code}
                    onChange={this.handleChange}
                    onKeyDown={this.keyDown}
                    rows="20"
                    cols="50"
                    wrap="hard"
                    autoComplete="off"
                    autoFocus
                ></textarea>
                <br />
                <input type="submit" value="submit"></input>
            </form>
        );
    }
}

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            code: (
                'function add(a, b) { \n' +
                '   return a + b;\n' + 
                '}\n' + 
                '\n' + 
                'add(1, 2);'
            )
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({code: e.target.value});
    }

    handleSubmit() {
        this.evaluateCode(this.state.code);
    }

    evaluateCode(strFunc) {
        console.log(esprima.parseScript(strFunc));
    }

    render() {
        return (
            <div>
                <Title></Title>
                <CodeForm
                    code={this.state.code}
                    handleSubmit={this.handleSubmit}
                    handleChange={this.handleChange}
                ></CodeForm>
            </div>
        )
    }

}


export default App;
