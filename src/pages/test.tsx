import React from 'react';
import RephraseTool from '~/components/rephraserTool';

interface Props {
  // Define your component's props here
}

const TestComponent: React.FC<Props> = ({ /* Destructure props here */ }) => {
  return (
    <div>
      <br></br>
      <br></br>
      <br></br>
      <br></br>
      <RephraseTool />
    </div>
  );
};

export default TestComponent;