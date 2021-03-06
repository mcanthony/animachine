import React from 'react'
import {connect} from 'react-redux'
import {getPickedDOMNode} from './store/selectors'
import {Button} from 'react-matterkit'

@connect(() => ({node: getPickedDOMNode()}))
export default class DomPicker extends React.Component {
  static propTypes = {
    node: React.PropTypes.object,
    onChange: React.PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {hover: false}
  }

  handleMouseEnter = (e) => {
    this.setState({hover: true})
  }

  handleMouseLeave = (e) => {
    // this.setState({hover: false})
  }

  render() {
    const {node, onChange} = this.props

    if (!node) {
      return <div hidden/>
    }

    const {left, top, width, height} = node.getBoundingClientRect()
    const buttonSize = 21
    const borderSize = 2
    const baseStyle = {
      position: 'fixed',
      left, top, width, height,
      boxSizing: 'border-box',
      pointerEvents: 'none',
      borderStyle: 'solid',
      borderColor: '#eee',
      borderWidth: borderSize,
      pointerEvents: 'auto',
    }
    const dashedStyle = {
      width: '100%',
      height: '100%',
      borderStyle: 'dashed',
      borderColor: '#444',
      borderWidth: borderSize,
      transform: `translate(-${borderSize}px,-${borderSize}px)`,
    }
    const buttonContainerStyle = {
      position: 'absolute'
    }

    function selectNode(nextNode) {
      const {actions} = BETON.require('project-manager')
    }

    function renderButton(icon, tooltip, onClick, style) {
      if (style.margin) {
        style = {
          ...style,
          position: 'absolute',
          margin: null,
          marginTop: style.margin[0],
          marginBottom: style.margin[0],
          marginLeft: style.margin[1],
          marginRight: style.margin[1],
        }
      }
      return <Button
        icon = {icon}
        tooltip = {tooltip}
        onClick = {onClick}
        style = {style}/>
    }

    return <div
      ref = {c => console.log("dddddddddddDDDD", React.findDOMNode(c))}
      style = {baseStyle}
      onMouseEnter = {this.handleMouseEnter}
      onMouseLeave = {this.handleMouseLeave}>
      <div style={dashedStyle}/>
      <div style={buttonContainerStyle} hidden={!this.state.hover}>
        {renderButton(
          'angle-up',
          'up one level',
          () => selectNode(node.parentElement),
          {top: `-${buttonSize}px`, left: 0, right: 0, margin: ['0', 'auto']}
        )}
        {renderButton(
          'angle-right',
          'next sibling',
          () => selectNode(node.nextElementSibling),
          {right: `-${buttonSize}px`, top: 0, bottom: 0, margin: ['auto', '0']}
        )}
        {renderButton(
          'angle-down',
          'down one level',
          () => selectNode(node.firstElementChild),
          {bottom: `-${buttonSize}px`, left: 0, right: 0, margin: ['0', 'auto']}
        )}
        {renderButton(
          'angle-left',
          'previous sibling',
          () => selectNode(node.previousElementSibling),
          {left: `-${buttonSize}px`, top: 0, bottom: 0, margin: ['auto', '0']}
        )}
        {/*renderButton(
          'cancel',
          'close',
          () => {},
          {right: `-${buttonSize}px`, top: `-${buttonSize}px`}
        )*/}
        {renderButton(
          'plus',
          'create a new track with this node',
          () => {},
          {right: `-${buttonSize}px`, bottom: `-${buttonSize}px`}
        )}
      </div>
    </div>
  }
}
