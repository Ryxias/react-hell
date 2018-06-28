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
    const api_url = `https://slack.com/api/files.list?token=${context.token}&count=${context.deleteLimit}&ts_to=${context.ageLimit}&types=${eventType}&page=${page}`;
    return httpClient.get(api_url)
      .then(res => {
        let itemCount = 1;
        const result = res.data;
        result.files.forEach(file => {
          if (file.is_starred !== true && !file.pinned_to) {
            if (context.list.length < context.deleteLimit) {
              context.list.push(file);
            }
          } else {
            ignoreCount += 1;
          }
        });
        // got max amount of items from current page that are not starred/pinned
        if ((page * context.deleteLimit) - ignoreCount >= context.deleteLimit) {
          if (context.list.length > 0) {
            context.log('The following files will be deleted:\n');
            context.list.forEach(file => {
              context.log(itemCount + ') NAME: ' + file.name + '\n   TITLE: ' + file.title);
              itemCount += 1;
            });
            return context.list;
          } else {
           context.log(`No files of type '${eventType}' found.`);
           context.log('Returning to main menu...\n');
           return context.list;
          }
        } else {
          // if less than 5 items, go to next page to get more items
          if (page < result.paging.pages) {
            return this.fetchList(context, eventType, ignoreCount, page + 1);
          } else {
            // return what you got if no more pages
            if (context.list.length > 0) {
              context.log('The following files will be deleted:\n');
              context.list.forEach(file => {
                context.log(itemCount + ') NAME: ' + file.name + '\n   TITLE: ' + file.title);
                itemCount += 1;
              });
              return context.list;
            } else {
              context.log(`No files of type '${eventType}' found.`);
              context.log('Returning to main menu...\n');
              return context.list;
            }
          }
        }
      }).catch(err => {
        return console.error(err);
      });
  }
}

module.exports = Fetcher;
