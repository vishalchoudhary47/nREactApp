import React, { Component } from 'react';
import { Card, CardImg, CardBody, CardTitle, CardText, Breadcrumb, BreadcrumbItem, 
    Button, Modal, ModalHeader, ModalBody, Row, Col, Label } from 'reactstrap';
import {Control, LocalForm, Errors} from 'react-redux-form';
import { Link } from 'react-router-dom';
import { Loading } from './LoadingComponent';
import { baseUrl} from '../shared/baseUrl';
import {FadeTransform, Fade, Stagger} from 'react-animation-components';

const required = (val) => val && val.length;
const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => val && (val.length >= len);

class CommentForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isModalOpen: false
        };

        this.toggleModal = this.toggleModal.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    toggleModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen
        });
    }

    handleSubmit(values) {
      this.toggleModal();
      this.props.postComment(this.props.dishId, values.rating ,values.author ,values.commnet);
    }

    render() {
        return (
            <div>
                <Button outline type="submit" onClick={this.toggleModal}>
                    <span className="fa fa-pencil fa-lg" ></span>
                    Submit Comment
                </Button>

                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader>Submit Comment</ModalHeader>
                    <ModalBody>
                        <LocalForm onSubmit={this.handleComment}>
                            <Row className="form-group" >
                                <Label md={2} >Rating</Label>
                                <Col md={{size: 12}}>
                                    <Control.select model=".rating" name="rating" className="form-control" >
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                    </Control.select>
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Label htmlFor="name" md={4} >Your Name</Label>
                                <Col md={{size: 12}} >
                                    <Control.text 
                                        model=".name" 
                                        id="name" 
                                        placeholder="Your Name" 
                                        className="form-control"
                                        validators={{
                                            required,
                                            maxLength: maxLength(15),
                                            minLength: minLength(3)
                                        }} />
                                        <Errors
                                            className="text-danger"
                                            model=".name"
                                            show="touched"
                                            messages={{
                                                required: 'Name is required ',
                                                maxLength: 'Must be less than 15 o less characters ',
                                                minLength: 'Must be greater than 2 characters'
                                            }} />
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Label htmlFor="comment" md={2} >Comment</Label>
                                <Col md={12} >
                                    <Control.textarea 
                                        model=".comment" 
                                        id="comment" 
                                        placeholder="comment" 
                                        rows="5" 
                                        className="form-control" />
                                </Col>
                            </Row>
                            <Button type="submit" value="submit" color="primary" >Submit</Button>
                        </LocalForm>
                    </ModalBody>
                </Modal>
            </div>
        )
    }
}


function RenderDish({ dish }) {
    
        return (
            <div className="col-12 col-md-5 m-1">
                <FadeTransform in
                    transformProps={{
                        exitTransform: 'scale(0.5) translateY(-50%)'
                    }}>
                    <Card>
                        <CardImg width="100%" src={baseUrl + dish.image} alt={dish.name}></CardImg>
                        <CardBody>
                            <CardTitle>{dish.name}</CardTitle>
                            <CardText>{dish.description}</CardText>
                        </CardBody>
                    </Card>
                </FadeTransform>
            </div>
        );
    
}

function RenderComments({comments, postComment, dishId}) {
    if (comments != null)
        return(
           <div className="col-12 col-md-5 m-1">
              <h4>Comments</h4>
              <ul className="list-unstyled">
                 <Stagger in>
                     {comments.map((comment) => {
                         return(
                            <Fade in>
                                <li key={comment.id}>
                                    <p>{comment.comment}</p>
                                    <p>
                                        -- {comment.author}{" "}
                                        {new Intl.DateTimeFormat("en-US", {
                                          year: "numeric",
                                          month: "short",
                                          day: "2-digit",
                                        }).format(new Date(Date.parse(comment.date)))}
                                    </p>
                                </li> 
                            </Fade>
                         );
                     })}
                 </Stagger>
              </ul>
              <CommentForm dishId={dishId} postComment={postComment} />
           </div>
        );
    else
        return(
            <div></div>
        );
        
               
}

const DishDetail = (props) => {
    if(props.isLoading){
        return(
            <div className="container">
               <div className="row">
                   <Loading />
               </div>
            </div>
        );
    }
    else if (props.errMess){
        return(
            <div className="container">
               <div className="row">
                   <h4>{props.errMess}</h4>
               </div>
            </div>
        );
    }

    else if (props.dish != null)
        return (
            <div className="container">
                <div className="row">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to="/home">Home</Link></BreadcrumbItem>
                        <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                        <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="col-12">
                        <h3>{props.dish.name}</h3>
                        <hr />
                    </div>
                </div>
                <div className="row">
                    <RenderDish dish={props.dish} />
                    <RenderComments comments={props.comments} 
                        postComment={props.postComment}
                        dishId={props.dishId} />
                </div>
            </div>

        );
        else
          return(
            <div></div>
          );
}




export default DishDetail;