import React from 'react';

let data = [
    {
        name: 'Team   ',
        text: 'daniel (React, IOS) caroline (design) emma (cookies) austin (voice SDK) '
    },
    {
        name: 'About  ',
        text: 'brainstorming web+mobile app'
    },
    {
        name: 'Get React client app',
        text: 'https://github.com/volkfox/Thundr-ReactNative-client/'
    },
    {
        name: 'Get native IOS app',
        text: 'https://github.com/volkfox/Thundr'
    }
];

class Tbs extends React.Component {
    constructor() {
        super();

        this.state = {
            activeTab: -1,
            data: data
        }

        this.changeTabOnClick = this.changeTabOnClick.bind(this);
    }

    changeTabOnClick(index) {
        this.setState({
            activeTab: index
        });
    }

    componentDidMount() {
        setInterval( () => this.setState({activeTab: -1}), 7000);
    }

    render() {
        return (
            <div className="tabs-body">
                <TabHeader data={this.state.data}
                              click={this.changeTabOnClick}
                              activeId={this.state.activeTab} />
                <TabContent data={this.state.data}
                               activeId={this.state.activeTab} />
            </div>
        )
    }
}

class TabHeader extends React.Component {
    doClick(index, event) {
        this.props.click(index);
    }

    render() {
        let activeClass = this.props.activeId;

        let tabs = this.props.data.map((item, index) => {
            return <li key = {index} className={(activeClass === index ? 'active' : '')}>
                        <a onClick={this.doClick.bind(this, index)} ><span>{item.name}</span></a>
                    </li>
        });

        return (
            <ul className="tabs-header">{tabs}</ul>
        )
    }

}

class TabContent extends React.Component {
    render() {
        let activeClass = this.props.activeId;

        let content = this.props.data.map((item, index) => {
            return <div  key = {index}  className={'tabs-textItem ' + (activeClass === index ? 'show' : '')} ><p>{item.text}</p></div>
        });

        return (
            <div className="tabs-content">{content}</div>
        );
    }
}

export default Tbs
