/**
 * Created by charnjeetelectrovese@gmail.com on 7/9/2019.
 */
import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


const CustomRouter = (props) => {
    console.log('customRouter', props);
  const { component: Component, ...rest } = props;
  if (!props.is_authenticated && props.private) {
      return (  <Route {...rest} render = {(childProps) => (
              <Redirect to={{
                  pathname : '/login',
                  state : { from: childProps.location}
              }}/>
          )}
          />
      )
  }
  return (<Route
    {...rest}
    render={(childProps) => {
      return (
        <Component {...childProps} board_type={props.board_type} category={props.category}  />
      );
    }
            }
  />
  );
};

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
  }, dispatch);
}

function mapStateToProps(state) {
  return {
    is_authenticated: state.auth.is_authenticated,
    //   category: state.common.category,
    //   board_type: state.common.board_type,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomRouter);
