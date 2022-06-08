import React from 'react'
import {Modal, Button} from 'react-bootstrap'

const SignUpModal = ({show, onHide}) =>{
    return (
        <Modal
    
      show = {show}
      onHide = {onHide}

      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          signUp
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h4>WELCOME</h4>
        <p>
          회원가입 완료!
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
    
}
export default SignUpModal