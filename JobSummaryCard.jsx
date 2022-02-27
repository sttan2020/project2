import React, { Fragment }  from 'react';
import Cookies from 'js-cookie';
import { Popup, Card, Button, Label, Icon, Pagination, Dropdown, Header, Container, Divider } from 'semantic-ui-react';
import moment from 'moment';

export class JobSummaryCard extends React.Component {
    constructor(props) {
        super(props);
        this.selectJob = this.selectJob.bind(this)
    }

    selectJob(id) {
        console.log(id);
        var cookies = Cookies.get('talentAuthToken');
        $.ajax({
            url: 'https://talentmservicestalent.azurewebsites.net/listing/listing/closeJob',
            headers: {
            'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
        },
            dataType: "json",
            type: "POST",
            data : JSON.stringify(id),
            success: function (res) {
                        if (res.success == true) {
                            TalentUtil.notification.show(res.message, "success", null, null);
                            window.location = "/ManageJobs";

                        } else {
                            TalentUtil.notification.show(res.message, "error", null, null)
                        }

                    }.bind(this)
    })
 }

    render() {
       
        const activePage = this.props.activePage;
        const indexofLastItem = activePage * 3;
        const indexofFirstItem = indexofLastItem - 3;

        const theList = this.props.jobs.slice(indexofFirstItem, indexofLastItem);
        const totalPages = this.props.totalPages
        

        return (
            <Fragment>
                
                {this.props.jobs.length === 0 ? <h1>No Jobs Found</h1> : <Card.Group>
                    {theList.map((job) => <Card key={job.id}>
                        <Card.Content>
                            <Card.Header>{job.title}</Card.Header>
                            <Label as='a' color='black' ribbon='right'>
                                <Icon name="user" /> {job.noOfSuggestions}
                            </Label>
                            <Card.Meta>
                                {job.location.city}, {job.location.country}
                            </Card.Meta>
                            <Card.Description>
                                {job.summary}
                            </Card.Description>

                        </Card.Content>
                        <Card.Content extra>
                            {new Date(job.expiryDate) < new Date(new Date().toDateString()) ? <Label color='red' >Expired</Label> : <Label> Expire on {moment(job.expiryDate).format('DD/MM/YYYY')}</Label>}
                                
                            <Divider fitted hidden />

                            <Button.Group floated="right" size='tiny' basic color='blue' >
                                <Button disabled={Boolean(job.status)} onClick={() => this.selectJob(job.id)}>
                                    <Icon name="ban" />Close</Button>

                                {job.status === 1 ? <Button disabled={Boolean(job.status)}><Icon name='edit' />Edit</Button> :         
                                 <Button as='a' href={`/EditJob/${job.id}`}  ><Icon name='edit' />Edit</Button>
                                }

                                <Button><Icon name='copy' />Copy</Button>

                            </Button.Group>

                        </Card.Content>
                    </Card>)}

                </Card.Group>
                }
                <br />
                <Container textAlign="right"  >
                    <Pagination
                    
                    activePage={activePage}
                    totalPages={totalPages}
                    firstItem={null}
                    lastItem={null}
                    ellipsisItem={'undefined'}
                    onPageChange={(e, { activePage }) => this.props.handlePageChange(activePage)}
                    />
                   
                </Container>
                    < br />

            </Fragment>
        )

    }
}