import React from 'react'
import { Message, Icon, Image } from 'semantic-ui-react'
import pikachu from '../assets/pikachu.jpg'
 
const ErrorMessage = (props) => (
  <Message icon>
    <Image src={pikachu} size='tiny' spaced />
    <Message.Content>
      <Message.Header>{(props.title || "Ooops something went wrong") + " - Try again!"}<Icon className="pointerCursor" onClick={() => this.props.handleRefresh} name="refresh" /></Message.Header>
      {props.message || "Failed to load data."}
      
    </Message.Content>
  </Message>
)
 
export default ErrorMessage;