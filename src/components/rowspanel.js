import template from '../templates/rowspanel.jsx';

class RowsPanel {
    render() {
        const userActions = this.props.flux.getActions('user');
        const actions = {
            closePanel: () => 
                userActions.closePanel(),
            startHourChange: (event) => 
                userActions.startHourUpdated(event.target.value),
            startMinuteChange: (event) => 
                userActions.startMinuteUpdated(event.target.value),
            endHourChange: (event) => 
                userActions.endHourUpdated(event.target.value),
            endMinuteChange: (event) => 
                userActions.endMinuteUpdated(event.target.value),
        };
        return template(this.props, actions);
    }
}

export default RowsPanel;