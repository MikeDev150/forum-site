import { Component } from "react";
import { Link } from "react-router-dom";

export default class Footer extends Component{
    render() {
        return (
            <footer className="site-footer">
                <div className="footer-content">
                    <div className="about">
                        <h3>About Us</h3>
                        <p className="medium">
                        Aliquam porta velit orci, in volutpat est ullamcorper at. Curabitur nec placerat nisl, non facilisis neque. Curabitur vehicula rhoncus accumsan.
                        Donec ut nisi nibh. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Fusce non libero turpis.
                        Curabitur tincidunt dui at pulvinar dignissim. Aliquam sit amet pharetra sem. Maecenas elementum efficitur tortor eget accumsan. Donec a ipsum id neque placerat
                        </p>
                    </div>
                    <div className="legal">
                        <h3>Information</h3>
                        <Link to="/PrivacyPolicy" className="link">Privacy Policy</Link>
                        <Link to="/Contact" className="link">Contact Us</Link>
                    </div>
                </div>
            </footer>
        )
    }
}