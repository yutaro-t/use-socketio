import { useContext, useEffect, useRef } from "react";
import { Context } from "./context";

export function useSocket(eventKey, callback) {
  const socket = useContext(Context);
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  useEffect(() => {
    if (typeof eventKey === 'string') {
      function socketHandler() {
        callbackRef.current && callbackRef.current.apply(this, arguments);
      }

      socket.on(eventKey, socketHandler);
      return () => socket.removeListener(eventKey, socketHandler);
    } else if(typeof eventKey === 'object') {
      let subscriptions = {};
      for(let key in eventKey) {
        subscriptions[key] = () => {
          callbackRef.current && callbackRef.current.apply(this, arguments);
        };

        socket.on(key, subscriptions[key]);
      }
      return () => {
        for(let key in subscriptions) {
          socket.removeListener(key, subscriptions[key]);
        }
      };
    }
  }, ["eventKey"]);

  return socket;
}
