import * as React from 'react';
import { useRouter } from 'next/navigation';
import { LoginButtonConstants } from './LoginButtonConstants';
import './githubButton.css';

const LoginButton = (): React.ReactElement => {
	const router = useRouter();
	return (
		<div className="centered-container">
			<button className="github-btn" onClick={() => router.push('/api/auth/login')}>
				{/* <svg className="github-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M12 .297C5.373.297 0 5.67 0 12.297c0 5.434 3.546 10.054 8.45 11.682.618.114.845-.266.845-.59 0-.29-.01-1.257-.015-2.284-3.44.746-4.17-1.59-4.17-1.59-.564-1.435-1.376-1.82-1.376-1.82-1.128-.77.085-.754.085-.754 1.244.088 1.898 1.28 1.898 1.28 1.105 1.897 2.899 1.35 3.61 1.033.114-.797.43-1.346.784-1.656-2.74-.308-5.61-1.37-5.61-6.094 0-1.347.48-2.447 1.275-3.307-.127-.31-.554-1.566.122-3.26 0 0 1.034-.33 3.385 1.263a11.53 11.53 0 0 1 3-.404c1.015.006 2.037.136 3 .404 2.35-1.594 3.382-1.263 3.382-1.263.677 1.694.25 2.95.123 3.26.796.86 1.274 1.96 1.274 3.307 0 4.735-2.876 5.784-5.623 6.086.442.38.837 1.13.837 2.28 0 1.648-.015 2.978-.015 3.384 0 .326.222.708.85.588C20.46 22.34 24 17.73 24 12.297 24 5.67 18.627.297 12 .297z" />
        </svg> */}
				{LoginButtonConstants.SIGN_IN}
			</button>
		</div>
	);
};

export default LoginButton;
