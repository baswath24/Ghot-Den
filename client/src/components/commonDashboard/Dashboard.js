import React, { Component } from 'react'
import PropTypes  from 'prop-types'
import { connect } from 'react-redux'
import QuestionsFeed from '../QuestionGet/QuestionsFeed'
import { Link } from 'react-router-dom'
import { getQuestionsHome } from '../../actions/homeQuestionsActions'
import Spinner from '../common/Spinner'
import { getHodHome } from '../../actions/hodActions'
import FacultyFeed from '../hod/FacultyFeed'

class Dashboard extends Component {

  componentDidMount () {
    if(this.props.auth.user.role==='student') {
      this.props.getQuestionsHome(this.props.match.params.id);
    } else if(this.props.auth.user.role==='hod'){
      this.props.getHodHome(this.props.match.params.id);
    }
    console.log("Called");
  }
  render () {
    if(this.props.auth.user.role==='student') {
      const { questions, loading} = this.props.home
      let dashboardContent
      if ((questions === null) || loading ) {
        dashboardContent = <Spinner/>
      } else {
        dashboardContent = (
          <div>
            {/*<h1>Dashboard Loads</h1>*/}
            <QuestionsFeed questions={questions}/>
          </div>
        )
      }

      return (
        <div className='dashboard' style={{width:'100%'}}>
          <div id="content" className="snippet-hidden " >
            <div className="inner-content" >
              <div id="mainbar" >
                <div className="grid">
                  <div className="row d-flex justify-content-between">
                    <h1 className="grid--cell fl1 fs-headline1 text-center" style={{fontFamily: "Lobster",color: 'black',fontSize:'48px'}}> Top Questions </h1>
                    <div className="pull-right" style={{minWidth: '250px'}}><Link className="btn btn-primary btn-lg w-75" style={{minWidth: '250px'}} to="/askQuestion">Ask
                      Question</Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="comments">
              <div className="card card-body mb-3">
                {dashboardContent}
              </div>
            </div>
          </div>
        </div>
      )
    }else if(this.props.auth.user.role==='hod') {
      const { home, loading,faculty} = this.props.hod
      let dashboardContent
      if ((home === null) || loading ) {
        dashboardContent = <Spinner/>
      } else {
        if(!faculty) {
          dashboardContent = (
            <div className="col-md-12">
              <div className="desc">
                <h1 style={{boxShadow: '0 4px 8px 0 rgba(0, 0, 100, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',fontFamily: "'Lobster'"}}
                    className="rounded border bg-dark text-light text-center p-1 pl-3 pr-5">Department of {home.department.departmentName}</h1>
                <h3 className='text-center'>{home.noFaculty}</h3>
              </div>
            </div>
          )
        }else {
          dashboardContent = (
            <div className="col-md-12">
              <div className="desc">
                <h1 style={{boxShadow: '0 4px 8px 0 rgba(0, 0, 100, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',fontFamily: "'Lobster'"}}
                    className="rounded border bg-dark text-light p-1 pl-3 pr-5 text-center">Department of {home.department.departmentName}</h1>

                <table  className="tableGrid rounded border"
                        style={{boxShadow: '0 4px 8px 0 rgba(0, 0, 100, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',width : '100%'}} border="0">
                  <tbody>
                  <tr>
                    <td>
                      <strong style={{fontFamily: 'Arial', fontSize: '14pt'}}>Faculty Name</strong>
                    </td>
                    <td>
                      <strong style={{fontFamily: 'Arial', fontSize: '14pt'}}>Email Address </strong>
                    </td>
                    <td>
                      <strong style={{fontFamily: 'Arial', fontSize: '14pt'}}>Personal Website</strong>
                    </td>
                  </tr>
                  <FacultyFeed faculty = {home.faculty}/>
                  </tbody>
                </table>
              </div>
            </div>
          )
        }

      }
      return (
        <div className="container hodDashboard">
          <div className="row">
            {dashboardContent}
          </div>
        </div>
      )
    }

  }
}

Dashboard.propTypes = {
  getQuestionsHome: PropTypes.func.isRequired,
  getHodHome: PropTypes.func.isRequired,
  home: PropTypes.object.isRequired,
  hod: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  home: state.home,
  auth: state.auth,
  hod: state.hod
})

export default connect(mapStateToProps, { getQuestionsHome,getHodHome })(Dashboard)
