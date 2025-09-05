
export const getInitialSignals = () => [
  { id: 1, name: 'Main St & 1st Ave', status: 'green', mode: 'automatic', timing: 45, emergency: false },
  { id: 2, name: 'Main St & 2nd Ave', status: 'red', mode: 'automatic', timing: 30, emergency: false },
  { id: 3, name: 'Main St & 3rd Ave', status: 'yellow', mode: 'automatic', timing: 5, emergency: false },
  { id: 4, name: 'Main St & 4th Ave', status: 'green', mode: 'automatic', timing: 35, emergency: false },
  { id: 5, name: 'Oak St & 1st Ave', status: 'red', mode: 'automatic', timing: 25, emergency: false },
  { id: 6, name: 'Oak St & 2nd Ave', status: 'green', mode: 'automatic', timing: 40, emergency: false },
  { id: 7, name: 'Oak St & 3rd Ave', status: 'red', mode: 'automatic', timing: 20, emergency: false },
  { id: 8, name: 'Oak St & 4th Ave', status: 'yellow', mode: 'automatic', timing: 8, emergency: false },
  { id: 9, name: 'Pine St & 1st Ave', status: 'green', mode: 'automatic', timing: 50, emergency: false },
  { id: 10, name: 'Pine St & 2nd Ave', status: 'red', mode: 'automatic', timing: 15, emergency: false },
  { id: 11, name: 'Pine St & 3rd Ave', status: 'green', mode: 'automatic', timing: 42, emergency: false },
  { id: 12, name: 'Pine St & 4th Ave', status: 'red', mode: 'automatic', timing: 28, emergency: false }
];

export const getNextSignalState = (signal) => {
  let newTiming = signal.timing - 1;
  let newStatus = signal.status;

  if (newTiming <= 0) {
    switch (signal.status) {
      case 'green':
        newStatus = 'yellow';
        newTiming = 5;
        break;
      case 'yellow':
        newStatus = 'red';
        newTiming = Math.floor(Math.random() * 40) + 20;
        break;
      case 'red':
        newStatus = 'green';
        newTiming = Math.floor(Math.random() * 40) + 30;
        break;
      default:
        break;
    }
  }
  
  return { ...signal, status: newStatus, timing: newTiming };
};
