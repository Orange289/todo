import React, { Component } from 'react';
import './item-add-form.css';

export default class ItemAddForm extends Component {
  render () {
    const { onItemAdded } = this.props;

    return (
      <form className="item-add-form d-flex">
        <input type="text" 
              className="form-control" 
              onChange={this.onLabelChange}
              placeholder="What need to be done" />
        <button 
          className="btn btn-outline-secondary" 
          type="button"
          onClick={() => onItemAdded('Hello World')}>
          Add Item
        </button>
      </form>
    );
  }
}
