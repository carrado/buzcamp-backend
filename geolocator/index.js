import { axios, router as _router } from "../component/appHeaders.js";

_router.get("/bznai", function (req, res) {

    let result;

    let connectedCountries = ['Nigeria'];

    axios.get(`https://ipgeolocation.abstractapi.com/v1/?api_key=09736e0f03464783be1e7a894c2116f1`).then((response) => {
        result = response.data.country;

    if (result) {
        if (connectedCountries.includes(result)) {
            res.status(200).send({
                success: true,
                _valCn: result
            });
        }
        else {
            res.status(500).send({
                success: false,
                error: true,
            });
        }
        }
    });
});
export default _router;

