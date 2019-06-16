import React, { Component } from 'react';
import AppHeader from '../app-header';
import SearchPanel from '../search-panel';
import TodoList from '../todo-list';
import ItemStatusFilter from '../item-status-filter';
import ItemAddForm from '../item-add-form';

import './app.css';

export default class App extends Component {

  maxId = 100;

  state = {
    todoData: [
      this.createTodoItem('Drink Coffee'),
      this.createTodoItem('Build React App'),
      this.createTodoItem('Have a Lunch')
    ],
    term: '',
    filter: 'all'
  };

  search(items, term) {
    if (term.length === 0) {
      return items;
    };

    return items.filter((item) => {
      return item.label.toLowerCase().indexOf(term.toLowerCase()) > -1;
    })
  };

  filter(items, filter) {
    switch(filter) {
      case 'all':
        return items;
      case 'active':
        return items.filter((item) => !item.done);
      case 'done':
        return items.filter((item) => item.done);
      default:
        return items;
    }
  };

  onSearchChange = (term) => {
    this.setState({ term });
  };

  onFilterChange = (filter) => {
    this.setState({ filter });
  };

  createTodoItem(label) {
    return {
      label,
      important: false,
      done: false,
      id: this.maxId++ 
      // maxId - не находится в state, значит его можно менять, он никак не влияет на рендеринг
    }
  };

  deleteItem = (id) => {
    this.setState(({ todoData }) => {
      const idx = todoData.findIndex((el) => el.id === id);
      // todoData.splice(idx, 1);  - Плохая практика, так как НЕЛЬЗЯ ИЗМЕНЯТЬ СУЩЕСТВУЮЩИЙ STATE

      // [a, b, c, d, e]
      // [a, b,    d, e ]

      // const before = todoData.slice(0, idx);
      // const after = todoData.slice(idx + 1);
      // const newArray = [...before, ...after];
      // Сокращенный вариант ниже:

      const newArray = [
        ...todoData.slice(0, idx),
        ...todoData.slice(idx + 1)
      ];

      return {
        todoData: newArray
      };
    })
  };

  addItem = (text) => {
    // return console.log('Added', text);

    // 1 step - generate id
    // 2 step - add element in array

    const newItem = this.createTodoItem(text);

    this.setState(({ todoData }) => {
      // todoData.push(newItem);  - так нельзя делать, так как меняется существующий массив

      const newArr = [
        ...todoData,
        newItem
      ];

      return {
        todoData: newArr
      };
    
    });

  };

  toggleProperty(arr, id, propName) {
    const idx = arr.findIndex((el) => el.id === id);

    // 1. update object

    const oldItem = arr[idx];
    const newItem = { ...oldItem, [propName]: !oldItem[propName] }; // done здесь перезапишется

    // 2. construct new array

    return [
      ...arr.slice(0, idx),
      newItem,
      ...arr.slice(idx + 1)
    ];

  };

  onToggleDone = (id) => {
    this.setState(({ todoData }) => {

      return {
        todoData: this.toggleProperty(todoData, id, 'done')
      };
    
    })
  };

  onToggleImportant = (id) => {
    this.setState(({ todoData }) => {

      return {
        todoData: this.toggleProperty(todoData, id, 'important')
      };

    })
  };

  render() {
    const { todoData, term, filter } = this.state;
    const doneCount = todoData.filter((el) => el.done).length; // filter создает новый массив, поэтому стейт мы не меняем, всё ок
    const todoCount = todoData.length - doneCount;

    return (
      <div className="todo-app">
        <AppHeader toDo={todoCount} done={doneCount} />
        <div className="top-panel d-flex">
          <SearchPanel
            onSearchChange={this.onSearchChange} />
          <ItemStatusFilter
            filter={filter}
            onFilterChange={this.onFilterChange} />
        </div>

        <TodoList
          todos={this.filter(this.search(todoData, term), this.state.filter)}
          onDeleted={this.deleteItem}
          onToggleImportant={this.onToggleImportant}
          onToggleDone={this.onToggleDone}
        />

        <ItemAddForm
          onItemAdded={this.addItem} />
      </div>
    );
  }
};