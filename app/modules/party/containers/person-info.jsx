import React from 'react';
import { inject, observer } from 'mobx-react';
import axios from "axios"; // handles request
// change the cookie header name like the django name it
axios.defaults.xsrfHeaderName = "X-CSRFToken";

@inject('personStore') @observer
export default class PersonInfo extends React.Component{
    constructor( props ){
        super( props );
        this.state = {
            person : {}
        }
    }

    componentDidMount(){
        let person_id = this.props.params.personId;
        axios.get('party/getpersoninfo/'+person_id )
            .then( ( rs ) => {
                this.setState({
                    person : rs.data.person_info
                })
            })
    }
    render(){
        let { person } = this.state;
        return (
            <div className = 'row'>
                { person.f_name } { person.l_name }
            </div>
        );
    }
}