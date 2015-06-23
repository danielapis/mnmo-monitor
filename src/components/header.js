import template from '../templates/header.jsx';

class Header {
    render() {
        const actions = {
            menuToggleClicked: (event) => {
                event.stopPropagation();
                this.props.flux.getActions('user').menuVisibilityToggle();
            },
            groupsButtonClicked: () =>
                this.props.flux.getActions('user').openPanel('groups'),
            varsButtonClicked: () => {
                this.props.flux.getActions('user').openPanel('vars');
            },
            classButtonClicked: () => {
                this.props.flux.getActions('user').openPanel('classes');
            },
            rowsButtonClicked: () => {
                this.props.flux.getActions('user').openPanel('rows');
            },
            backButtonClicked: () => {
                this.props.flux.getActions('rows').rowsTypeSwitchClicked('detailed');
            }
        };
        return template(this.props, actions);
    }
}

export default Header;
