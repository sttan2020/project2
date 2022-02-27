import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Card, Button, Pagination, Icon, Dropdown, Checkbox, Accordion, Form, Container, Segment, Header } from 'semantic-ui-react';

export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        //console.log(loader)
        this.state = {
            loadJobs: [],
            loaderData: loader,
            activePage: 1,
            sortBy: {
                date: "desc"
            },
            filter: {
                showActive: true,
                showClosed: false,
                //showDraft: true,
                showExpired: true,
                showUnexpired: true
            },
            totalPages: 1,
            activeIndex: ""
        }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
 
        this.loadNewData = this.loadNewData.bind(this);
        //your functions go here
        this.handleChange = this.handleChange.bind(this);
        this.handleSort = this.handleSort.bind(this);
        this.showSortedValue = this.showSortedValue.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);

    };

    /**************************/
    handlePageChange(value) {
        //const data = Object.assign({}, this.state)
        //data['activePage'] = value
        this.setState({
            activePage: value
        })
        //this.loadNewData(data)
    }
    showSortedValue(dateOptions) {
        const { text } = dateOptions.find((x) => x.value === this.state.sortBy.date);
        return text;

    }
    handleSort(event, data) {
        const { sortBy } = this.state;
        sortBy.date = data.value;
        this.setState({ sortBy })

        const reload = Object.assign({}, this.state)
        this.loadNewData(reload)
        this.init();
    }

    handleChange(event, data) {
        //console.log(data);
        const { filter } = this.state;
        filter[data.label] = !this.state.filter[data.label]; // to change the state
        this.setState({ filter })

        const reload = Object.assign({}, this.state)
        this.loadNewData(reload)
        this.init();
    }

    /**************************/

    init() {
        let loaderData = TalentUtil.deepCopy(this.state.loaderData)
        loaderData.isLoading = false;
        this.setState({ loaderData });//comment this

        //set loaderData.isLoading to false after getting data
        //this.loadData(() =>
        //    this.setState({ loaderData })
        //)
        
        //console.log(this.state.loaderData)
    }

    componentDidMount() {
        this.init();
        this.loadData();
    };

    loadData(callback) {
     
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: 'https://talentmservicestalent.azurewebsites.net/listing/listing/getSortedEmployerJobs',
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            data: {
                activePage: this.state.activePage,
                sortbyDate: this.state.sortBy.date,
                showActive: this.state.filter.showActive,
                showClosed: this.state.filter.showClosed,
                showDraft: true,
                showExpired: this.state.filter.showExpired,
                showUnexpired: this.state.filter.showUnexpired,

            },
            contentType: "application/json",
            dataType: "json",
            success: function (res) {
                
                //console.log(res );
                this.setState({
                    loadJobs: res.myJobs,
                    totalPages: Math.ceil(res.myJobs.length / 3)
                })
              
                }.bind(this),
            error: function (res) {
                console.log(res.status)
            }
        })
       // your ajax call and other logic goes here
    }

    loadNewData(data) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadData: loader
                })
            })
        });
    }

    render() {

        const sortOptions = [
            {
                key: 'Newest first',
                text: 'Newest first',
                value: 'desc',
            },
            {
                key: 'Oldest first',
                text: 'Oldest first',
                value: 'asc',
            }
        ]
        const filterOptions = [
            {
                key: 'showActive',
                text: 'showActive',
                value: 'showActive',
            },
            {
                key: 'showClosed',
                text: 'showClosed',
                value: 'showClosed',
            },
            //{
            //    key: 'showDraft',
            //   text: 'showDraft',
            //    value: 'showDraft',
            //},
            {
                key: 'showExpired',
                text: 'showExpired',
                value: 'showExpired',
            },
            {
                key: 'showUnexpired',
                text: 'showUnexpired',
                value: 'showUnexpired',
            },
        ]


        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                <Container>
                <Header as='h1'> List of Jobs</Header>
                <Header as='h6'>
                    <Icon name='filter' />
                    <Header.Content>
                        Filter:
                            <Dropdown
                            multiple       
                            inline
                            text= "Choose filter"
                            options={filterOptions.map((filter) => <Dropdown.Item key={filter.key}>
                            <Checkbox onChange={this.handleChange} label={filter.value} defaultChecked={this.state.filter[filter.value]} />
                                </Dropdown.Item>)}
                            />
                    </Header.Content>

                    <Icon name='calendar' />
                    <Header.Content>
                            Sort by date:
                        <Dropdown
                            inline
                            text={this.showSortedValue(sortOptions)}
                            options={sortOptions}
                            defaultValue={sortOptions[0].value}
                            onChange={this.handleSort}
                                />
                              
                    </Header.Content>
                </Header>
               
                    <JobSummaryCard jobs={this.state.loadJobs} activePage={this.state.activePage} totalPages={this.state.totalPages} handlePageChange={this.handlePageChange} />
                    </Container>
      
                    
            </BodyWrapper>
             
        )
    }
}