'use strict';

const httpClient = require('axios');

class Fetcher {
  constructor() {
  }

  /**
   * Used to fetch the list of files that exist on the current workspace using the Slack API.
   * This automatically filters out any starred/pinned files deemed as important and provides
   * a list of 50 files at a time to satisfy the maximum API quota for deletion (50).
   *
   * @param eventType: to match the correct filter and action functions required for query and deletion
   * @param types: type of file used to sort the search query
   * @param itemCount: current item number on the file list
   * @param ignoreCount: number of skipped files due to it being starred/pinned
   * @param page: current page of the search query
   * @returns {*}
   */
  fetchList(context, eventType = 'all', ignoreCount = 0, page = 1) {
    let api_url = `https://slack.com/api/files.list?token=${context.token}&count=${context.deleteLimit}&ts_to=${context.ageLimit}&types=${eventType}&page=${page}`;
    return httpClient.get(api_url)
      .then(res => {
        let itemCount = 1;
        let result = res.data;
        result.files.forEach(file => {
          if (file.is_starred !== true && !file.pinned_to) {
            if (context.list.length < context.deleteLimit) {
              context.list.push(file);
            }
          } else {
            ignoreCount += 1;
          }
        });
        if ((page * context.deleteLimit) - ignoreCount >= context.deleteLimit) {
          console.log('The following files will be deleted:\n');
          return context.list.forEach(file => {
            console.log(itemCount + ') NAME: ' + file.name + '\n   TITLE: ' + file.title);
            itemCount += 1;
          });
        } else {
          if (page < result.paging.pages) {
            return this.fetchList(context, eventType, ignoreCount, page + 1);
          } else {
            console.log('The following files will be deleted:\n');
            return context.list.forEach(file => {
              console.log(itemCount + ') NAME: ' + file.name + '\n   TITLE: ' + file.title);
              itemCount += 1;
            });
          }
        }
      }).catch(err => {
        console.error(err);
      });
  }
}

module.exports = Fetcher;
