"""
Parameters

targets (List of String)
 - FQDN or IP address of the target/s. e.g. ["brokenweb.trendmicro.com", "192.168.0.1"]

network (String)
 - Refers to where can the scanner reach your target. Valid values are EXTERNAL, INTERNAL, ETSTW, ETSCN.

notification (Dictionary)
 - Email addresses that will receive the report. e.g. { "to": ["kevin_garcia@trendmicro.com"] }
"""
import warg
import csv
import io
import os
import sys

"""
Scans host with the provided parameters.
"""
def nessus_professional(client):
    results = client.warg('nessus-professional', data={
        'targets': sys.argv[1].split(','),
        'network': sys.argv[2].upper(),
        'notification': { 'to': sys.argv[3].split(',') },
        'prs_project_code': sys.argv[4]
    })

    return results

def process_results(results):
    results_io = io.StringIO(results.decode())
    results_csv = csv.reader(results_io)
    header = next(results_csv) # get header

    for line in results_csv:
        if len(header) == len(line):
            metadata = {
                'plugin_id': line[0],
                'cve': line[1],
                'cvss': line[2],
                'risk': line[3],
                'host': line[4],
                'protocol': line[5],
                'port': line[6],
                'name': line[7],
                'synopsis': line[8],
                'description': line[9],
                'solution': line[10],
                'see_also': line[11],
                'plugin_output': line[12],
            }

            print('name', metadata['name'])
            print('description', metadata['description'])
            print('severity', metadata['risk'].upper())
            print('metadata', metadata)

if __name__ == '__main__':
    # Create Warg client
    client = warg.Client(token=os.environ['WARG_TOKEN'])

    # Run Warg examples
    results = nessus_professional(client)

    # Write to file
    with open('warg-nessus-professional.csv', 'wb') as writer:
        writer.write(results)

    # Process the results
    process_results(results)
