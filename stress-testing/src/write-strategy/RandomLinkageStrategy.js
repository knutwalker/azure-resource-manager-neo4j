const Strategy = require('../Strategy');
const Promise = require('bluebird');
const uuid = require('uuid');

class RandomLinkageStrategy extends Strategy {
    constructor(props) {
        super(props);
        this.name = 'RandomLinkageStrategy';
        this.n = props.n || 1000000;
    }

    setup(driver) {
        return Promise.resolve(true);
    }

    run(driver) {
        if (!this.session) {
            this.session = driver.session();
        }

        this.lastQuery = `
            MATCH (a) 
            WITH a 
            SKIP $idx1 LIMIT 3 
            MATCH (b) WITH a,b 
            SKIP $idx2 LIMIT 3 
            CREATE (a)-[r:randomlinkage]->(b)
            RETURN count(r)
        `;
        
        this.lastParams = { idx1: this.randInt(this.n), idx2: this.randInt(this.n) };
        const f = () => this.session.run(this.lastQuery, this.lastParams);
        return this.time(f);
    }
}

module.exports = RandomLinkageStrategy;