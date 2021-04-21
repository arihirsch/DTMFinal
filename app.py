from flask import Flask
import math
import pandas as pd
from flask import request
from flask_cors import CORS, cross_origin
import numpy as np

g = globals()
app = Flask(__name__)
CORS(app)

@app.route('/')
def hello_world():
    return 'Hello World!'


@app.route('/price_protected_option', methods=["POST"])
@cross_origin()
def price_protected_option():
    option = request.get_json(force=True)["option"]
    print(option)
    steps = option["steps"]
    call = True if option["call"] == 1 else False
    put = True if option["put"] == 1 else False
    strike = option["strike_price"]
    start_price = option["start_price"]
    perc_movement = option["perc_movement"]
    deltaT = option["deltaT"]
    r = option["r"]

    u = 1 + perc_movement
    d = 1 - perc_movement

    p = (math.exp(r * deltaT) - d) / (u - d)
    q = 1 - p

    g['prev1'] = []

    for i in range(2, steps + 1):
        g['prev{0}'.format(i)] = []

    prev1.append(q)
    prev1.append(p)

    for i in range(2, steps + 1):
        last = g['prev{0}'.format(i - 1)]
        g['prev{0}'.format(i)].append(last[0] * q)
        lst = []
        for a in range(0, i - 1):
            lst.append((last[a]) * (p) + (last[a + 1]) * (q))
            g['prev{0}'.format(i)].append((last[a]) * (p) + (last[a + 1]) * (q))

        g['prev{0}'.format(i)].append(last[-1] * p)

    lst_price = []
    for a in range(0, steps + 1):
        lst_price.append(start_price * ((d ** (steps - a)) * (u ** (a))))

    lst_val = []
    call_payoff = []
    for i in lst_price:
        if call == True:
            lst_val.append(max(0, i - strike))
            call_payoff.append(-(max(0, i - strike)))
        if put == True:
            lst_val.append(max(0, strike - i))

    final_lst = []
    for a in range(0, steps + 1):
        final_lst.append(lst_val[a] * g['prev{0}'.format(steps)][a])

    sum_final = sum(final_lst)

    option_value = (math.exp(-(steps) * r * deltaT)) * (sum_final)

    df = pd.DataFrame()

    df["Stock Payoff"] = lst_price
    if call == True:
        df["Option Payoff"] = call_payoff
        df["Standard Profit"] = df["Option Payoff"] + option_value
        df["Covered Call Payoff"] = df["Stock Payoff"] + df["Option Payoff"]
        df["Covered Call Profit"] = df["Covered Call Payoff"] - start_price + option_value
    if put == True:
        df["Option Payoff"] = lst_val
        df["Standard Profit"] = df["Option Payoff"] - option_value
        df["Protective Put Payoff"] = df["Stock Payoff"] + df["Option Payoff"]
        df["Protective Put Profit"] = df["Protective Put Payoff"] - start_price - option_value

    return df.to_json(orient='records'), 200



@app.route('/find_ytm', methods=["POST"])
@cross_origin()
def find_ytm():
    bonds = request.get_json(force=True)["bonds"]
    print(bonds)
    list_bonds = []
    list_ytms = []
    for list_vars in bonds:
        list_bonds.append(list_vars[0].strip(" ' "))
        bp = list_vars[1]
        time = list_vars[2]
        coup = list_vars[3]
        bp_list = []
        ytm_test_list = []

        for i in np.arange(0, 1, 0.000001):
            ytm_test_list.append(i)
            sum_ = 0
            final_payment = 100 / ((1 + (i / 2)) ** time)
            for a in range(1, time + 1):
                periodic_payment = (coup / 2) / ((1 + (i / 2)) ** a)
                sum_ = sum_ + periodic_payment
            test_bp = sum_ + final_payment
            bp_list.append(test_bp)
            if test_bp < bp:
                list_ytms.append(i)
                break
    df = pd.DataFrame()
    df["Bond"] = list_bonds
    df["YTM"] = list_ytms

    return df.to_json(orient='records'), 200


@app.route('/price_options', methods=["POST"])
@cross_origin()
def price_options():
    options = request.get_json(force=True)["options"]
    print(options)
    lst_options = []
    lst_final_values = []

    for option in options:
        name = option["option_name"]
        steps = option["steps"]
        call = True if option["call"] == 1 else False
        put = True if option["put"] == 1 else False
        strike = option["strike_price"]
        start_price = option["start_price"]
        perc_movement = option["perc_movement"]
        deltaT = option["deltaT"]
        r = option["r"]

        print(name, steps, call, put, strike, start_price, perc_movement, deltaT, r)

        lst_options.append(name)

        u = 1 + perc_movement
        d = 1 - perc_movement

        p = (math.exp(r * deltaT) - d) / (u - d)
        q = 1 - p

        g['prev1'] = []

        for i in range(2, steps + 1):
            g['prev{0}'.format(i)] = []

        prev1.append(q)
        prev1.append(p)

        for i in range(2, steps + 1):
            last = g['prev{0}'.format(i - 1)]
            g['prev{0}'.format(i)].append(last[0] * q)
            lst = []
            for a in range(0, i - 1):
                lst.append((last[a]) * (p) + (last[a + 1]) * (q))
                g['prev{0}'.format(i)].append((last[a]) * (p) + (last[a + 1]) * (q))

            g['prev{0}'.format(i)].append(last[-1] * p)

        lst_price = []
        for a in range(0, steps + 1):
            lst_price.append(start_price * ((d ** (steps - a)) * (u ** (a))))

        lst_val = []
        for i in lst_price:
            if call == True:
                lst_val.append(max(0, i - strike))
            if put == True:
                lst_val.append(max(0, strike - i))

        final_lst = []
        for a in range(0, steps + 1):
            final_lst.append(lst_val[a] * g['prev{0}'.format(steps)][a])

        sum_final = sum(final_lst)

        option_value = (math.exp(-(steps) * r * deltaT)) * (sum_final)
        lst_final_values.append(option_value)

    df = pd.DataFrame()
    df["Bond"] = lst_options
    df["Value"] = lst_final_values

    highest_value = max(lst_final_values)

    best_option = lst_options[lst_final_values.index(highest_value)]

    # return json of the dataframe basically
    return df.to_json(orient='records'), 200


if __name__ == '__main__':
    app.run()
