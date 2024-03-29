import React from "react"

class Indecision extends React.Component {
    constructor() {
        super()

        this.state = {
            options: []
        }

        this.handleDeleteOptions = this.handleDeleteOptions.bind(this)
        this.handleRandOptions = this.handleRandOptions.bind(this)
        this.handleAddOption = this.handleAddOption.bind(this)
        this.handleDeleteOption = this.handleDeleteOption.bind(this)
    }

    componentDidMount() {
        try {
            const json = localStorage.getItem('options')
            const options = JSON.parse(json)
    
            if (options) {
                this.setState({
                    options: options
                })
            }
        }
        catch(event) {

        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.options.length !== this.state.options.length)  {
            console.log("Saving data")
            const json = JSON.stringify(this.state.options)

            localStorage.setItem('options', json)
        }
    }

    componentWillUnmount() {
        console.log("Component will unmount!")
    }

    handleDeleteOptions() {
        this.setState(() => ({options: [] }))
    }

    handleDeleteOption(optionToRemove) {
        this.setState((prevState) => ({
            options: prevState.options.filter((option) => 
                optionToRemove !== option
            )
        }))
    }

    handleRandOptions() {
        const randNum = Math.floor(Math.random() * this.state.options.length)
        const options = this.state.options[randNum]
        console.log(options)
    }

    handleAddOption(option) {
        if (!option) {
            return "Enter valid options to add items."
        }
        else if (this.state.options.indexOf(option) > -1) {
            return "This option already exists!"
        }

        this.setState((prevState) => ({
            options: prevState.options.concat([option])
        }))
    }

    render() {
        const title = "Indecision Another"
        const subtitle = "Put your life in the hands of a computer!"

        return(
            <div>
                <Header title={title} subtitle={subtitle}/>
                <Action 
                    hasOptions={this.state.options.length > 0} 
                    handleRandOptions={this.handleRandOptions}
                />
                <Options 
                    options={this.state.options}
                    handleDeleteOptions={this.handleDeleteOptions}
                    handleDeleteOption={this.handleDeleteOption}
                />
                <AddOption 
                    handleAddOption={this.handleAddOption}
                />
            </div>
        )
    }
}

const Header = (props) => {
    return(
        <div>
            <h1>{props.title}</h1>
            <h2>{props.subtitle}</h2>
        </div>
    )
}

const Action = (props) => {
    return(
        <div>
            <button
                disabled={!props.hasOptions}
                onClick={props.handleRandOptions}
            >
                What should I do?
            </button>
        </div>
    )
}

const Options = (props) => {
    return(
        <div>
            <button
                onClick={props.handleDeleteOptions}
            >Remove all options.</button>

            {
                props.options.length === 0 && <p>Please add an option to get started!</p>
            }

            <br />

            <p>Length of options: {props.options.length}</p>

            {
                props.options.map((option, i) => (
                    <Option 
                        key={i}
                        optionText={option}
                        handleDeleteOption={props.handleDeleteOption}
                    /> 
                ))
            }
        </div>
    )
}

const Option = (props) => {
    return(
        <div>
            {props.optionText}
            <button
                onClick={(event) => {
                    props.handleDeleteOption(props.optionText)
                }}
            >
                Delete this
            </button>
        </div>
    )
}

class AddOption extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            error: undefined
        }

        this.handleAddOption = this.handleAddOption.bind(this)
    }
    
    handleAddOption(event) {
        event.preventDefault()
        const option = event.target.elements.option.value.trim()
        const error = this.props.handleAddOption(option)

        this.setState(() => 
            ({error})
        )

        if (!error) {
            event.target.elements.option.value = ""
        }
    }
    
    render() {
        return(
            <div>
                {this.state.error && <p>{this.state.error}</p>}
                <form onSubmit={this.handleAddOption}>
                    <input type="text" name="option"/>
                    <button>Add option</button>
                </form>
            </div>
        )
    }
}

export default Indecision