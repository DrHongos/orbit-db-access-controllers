'use strict'

const AccessController = require('./access-controller-interface')

const type = 'eth-contract/my-contract-ac'

class ContractAccessController extends AccessController {
  constructor(web3, abi, address) {
    super()
    this.web3 = web3
    this.abi = abi
    // this.contract = new this.web3.eth.Contract(abi, address)
    this.contractAddress = address
  }

  // Returns the type of the access controller
  static get type () { return type }

  async load (address, options) {}

  async save () {
    return { 
      contractAddress: this.contractAddress, 
      abi: this.abi 
    }
  }

  async canAppend (entry, identityProvider) {
    // Write the custom access control logic here
    // return await this.contract.methods.haveTheyPaidTheDeposit(entry.identity.id).call()
    return await this.contract.methods.isPermitted(identifier, this.web3.utils.fromAscii('write')).call()
  }

  async grant (identifier, capability) {
    // return await this.contract.methods.paidTheirDeposit(identifier).call()
    return await this.contract.methods.grantCapability(identifier, this.web3.utils.fromAscii(capability)).send( { from: this.primaryAccount } )
  }

  async revoke (identifier, capability) {
    // return await this.contract.methods.didntPayTheirDeposit(identifier).call()
    return await this.contract.methods.revokeCapability(identifier, this.web3.utils.fromAscii(capability)).send( { from: this.primaryAccount } )
  }

  // Factory
  static async create (orbitdb, options) {
    if (!options.web3) {
      throw new Error(`No 'web3' given in options`)
    }
    if (!options.abi) {
      throw new Error(`No 'abi' given in options`)
    }
    if (!options.contractAddress) {
      throw new Error(`No 'contractAddress' given in options`)
    }

    return new ContractAccessController(
      options.web3, 
      options.abi, 
      options.contractAddress
    )
  }
}

module.exports = ContractAccessController