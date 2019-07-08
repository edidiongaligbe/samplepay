import React, { Component } from "react";
import axios from "axios";

class Counter extends Component {
  state = {
    amount: "",
    CIN: "",
    pay: false
  };

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

  putDataToDB = () => {
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
        let pID = response.data.ref;
        window.paymentUpdate =
          "Payment was successful. Please take note of the payment ID: " + pID;
        console.log(response);
        console.log(pID);
      })
      .catch(function(error) {
        window.paymentUpdate = "Unable to make payment, please try again later";
        console.log(error);
      });
    this.setState({ pay: true });
  };

  returnPaid() {
    return (
      <button type="submit" className="btn btn-primary">
        Done
      </button>
    );
  }

  returnNotPaid() {
    return (
      <div className="card-body">
        <h5 className="card-title">Accepted Cards</h5>
        <div>
          <img
            src="https://res.cloudinary.com/dwu98rqwi/image/upload/v1562154514/visa.jpg"
            alt="visa"
            className="pcard"
          />
          <img
            src="https://res.cloudinary.com/dwu98rqwi/image/upload/v1562154514/mastercard.jpg"
            alt="master"
            className="pcard"
          />
          <img
            src="https://res.cloudinary.com/dwu98rqwi/image/upload/v1562154514/amex.jpg"
            alt="amex"
            className="pcard"
          />
        </div>
        <p className="card-text wtext">
          With supporting text below as a natural lead-in to
        </p>
        <p>
          <b>Amount:</b> {this.getamount()}
          <br />
          <b>Customer No.:</b> {this.getcin()}
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
      </div>
    );
  }

  render() {
    return (
      <div className="container d-flex flex-column min-vh-100">
        <div className="row flex-grow-1 justify-content-center align-items-center">
          <div className="payHolder">
            <div className="card ">
              <div className="card-header">
                <h4>Payment Details</h4>
              </div>
              {this.state.pay ? this.returnPaid() : this.returnNotPaid()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Counter;
