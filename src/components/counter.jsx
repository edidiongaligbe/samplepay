import React, { Component } from "react";
import axios from "axios";

class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: "",
      CIN: "",
      paymentUpdate: null,
      paymentStatus: null,
      pay: false
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    let burl = this.geturl();
    let proxyUrl = "https://edcorsanywhere.herokuapp.com/";
    console.log(burl);

    fetch(proxyUrl + burl)
      .then(response => alert(response.text))
      .catch(error => console.error("Error:", error));
  }

  getcin = () => {
    let cin = window.cin;
    return cin;
  };

  getamount = () => {
    let amount = window.amount;
    return amount;
  };

  getPayFor = () => {
    let payFor = window.payFor;
    return payFor;
  };

  geturl = () => {
    let wurl = window.callback_url;
    return wurl;
  };

  getpaymentUpdate = () => {
    return this.state.paymentUpdate;
  };

  setUpdate(msg) {
    this.setState({ paymentUpdate: msg });
  }

  putDataToDB = () => {
    var self = this;
    let cin = this.getcin();
    let amount = this.getamount();
    let payFor = this.getPayFor();

    //send payment to database and set the state of payment to true.
    axios.defaults.headers.post["Content-Type"] = "application/json";
    axios
      .post("https://testboteddy.herokuapp.com/api/makepayment", {
        meterNumber: cin,
        Amount: amount,
        Item: payFor
      })

      .then(function(response) {
        let pID =
          "Payment was successful. Please take note of the payment ID: " +
          response.data.ref;
        self.setState({ paymentUpdate: pID });
        self.setState({ paymentStatus: "Success" });
        console.log(response);
        console.log(pID);
      })

      .catch(function(error) {
        self.setState({
          paymentUpdate:
            "Unable to make payment, sorry for the inconvenience. If you want to try again, kindly close this tab and initiate payment from EIDA."
        });
        self.setState({ paymentStatus: "Failure" });
        console.log(error);
      });

    this.setState({ pay: true });
  };

  returnToBot = () => {
    let callbackURL = this.geturl();
    let update = this.getpaymentUpdate();

    axios.defaults.headers.post["Content-Type"] = "application/json";
    axios
      .post(callbackURL, {
        payment: update
      })

      .then(function(response) {
        console.log(response);
      })

      .catch(function(error) {
        console.log(error);
      });

    this.setState({ pay: true });
  };

  returnPaid() {
    return (
      <React.Fragment>
        <form onSubmit={this.handleSubmit}>
          <p>
            <b>{this.state.paymentUpdate}</b>
          </p>
          <br />
          <input type="hidden" id="custId" name="custId" value="hold" />
          <br />
          <button type="submit" className="btn btn-primary doneButton">
            Done
          </button>
        </form>
      </React.Fragment>
    );
  }

  returnNotPaid() {
    return (
      <React.Fragment>
        <div>
          <label>
            <b>Accepted Cards: </b>
          </label>
          <img
            src="https://res.cloudinary.com/dwu98rqwi/image/upload/c_scale,w_39/v1562154514/visa.jpg"
            alt="visa"
            className="pcard"
          />
          <img
            src="https://res.cloudinary.com/dwu98rqwi/image/upload/c_scale,w_39/v1562154514/mastercard.jpg"
            alt="master"
            className="pcard"
          />
          <img
            src="https://res.cloudinary.com/dwu98rqwi/image/upload/c_scale,w_39/v1562154514/amex.jpg"
            alt="amex"
            className="pcard"
          />
        </div>
        <br />
        <p>
          <b>Amount:</b> {this.getamount()}
          <br />
          <b>Customer No.:</b> {this.getcin()}
          <br />
          <b>Item:</b> {this.getPayFor()}
        </p>
        <form>
          <div className="form-group">
            <label>Card Number</label>
            <input
              type="text"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              pattern="[0-9]{16}"
              required
              autoComplete="off"
            />
          </div>
          <div className="form-group">
            <label>Expiration Date</label>
            <input
              type="text"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              required
              autoComplete="off"
              placeholder="MM/YY"
            />
          </div>
          <div className="form-group">
            <label>CVV</label>
            <input
              type="text"
              className="form-control"
              id="exampleInputEmail1"
              aria-describedby="emailHelp"
              required
              autoComplete="off"
              placeholder="000"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            onClick={() => this.putDataToDB()}
          >
            Pay Now
          </button>
        </form>
      </React.Fragment>
    );
  }

  render() {
    return (
      <div className="container  py-3">
        <div className="form-row justify-content-center">
          <div className="col-sm-6 justify-content-center">
            <div className="payHolder">
              <div className="card ">
                <div className="card-header">
                  <h4>Payment Details</h4>
                </div>
                <div className="card-body">
                  {this.state.pay ? this.returnPaid() : this.returnNotPaid()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Counter;
