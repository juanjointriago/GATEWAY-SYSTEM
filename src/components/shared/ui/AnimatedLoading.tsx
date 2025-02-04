import Lottie from 'lottie-react';

import * as LoadingLottie from '../../../assets/lotties/loading.json';
import { useRef } from 'react';

export const AnimatedLoading = () => {
    const lottie = useRef(null)
  return (
    <Lottie ref={lottie} animationData={LoadingLottie} loop style={{ width: '100%', height: '100%' }} />
  )
}
