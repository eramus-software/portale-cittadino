import { Popover, PopoverHeader, PopoverBody, Button } from "design-react-kit";
import { Icon } from "design-react-kit";
import React, {  useState, useRef } from "react";

export default function MyPopover(props){
  const [popoverOpen, setPopoverOpen] = useState(false);
  const togglePopover = () => {
    setPopoverOpen(!popoverOpen);
  };

  function openSana(e) {
    e.preventDefault();
    window.open(`https://sana.interno.it/index.php`);
  }

  const targetRef = useRef(null);
    return(
      <>
        <Button className={props.className} onClick={togglePopover} innerRef={targetRef} type={props.type} color={props.color} >
          {props.title}
        </Button>
        <Popover
          placement='bottom'
          target={targetRef}
          isOpen={popoverOpen}
          toggle={togglePopover}
          style={{height:"330px", width:"500px", backgroundColor:"white"}}
        >
          <PopoverHeader>
            <Icon icon='it-help-circle' aria-hidden />
            <h6 className="mt-2">Informazioni SANA</h6>
          </PopoverHeader>
          <PopoverBody>
            <small>Gentile utente, attraverso il tasto di seguito indicato potrà trasmettere alla prefettura il ricorso riferito alla sanzione amministrativa notificata.</small>
            <br/>
            <small>Una volta aperto il portale SANA dovrà cliccare sulla voce “Sistema informativo sanzionatorio amministrativo delle Prefetture” , cliccare poi “SANA – per il cittadino” ed inserire i dati inerenti al ricorso.</small>
            <a onClick={openSana} className='popover-inner-link'>
              Vai al sito
              <Icon icon='it-arrow-right' aria-hidden />
            </a>
          </PopoverBody>
        </Popover>
      </>
    )
}