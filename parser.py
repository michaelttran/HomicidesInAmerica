import csv
from collections import defaultdict

state_lookup = ['Alaska', 'Alabama', 'Arkansas', 'Arizona', 'California', 'Colorado', 'Connecticut', 'District of Columbia',
                'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Iowa', 'Idaho', 'Illinois', 'Indiana', 'Kansas', 'Kentucky',
                'Louisiana', 'Massachusetts', 'Maryland', 'Maine', 'Michigan', 'Minnesota', 'Missouri', 'Mississippi',
                'Montana', 'Nebraska', 'North Carolina', 'North Dakota', 'New Hampshire', 'New Jersey', 'New Mexico',
                'Nevada', 'New York', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhodes Island', 'South Carolina',
                'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Virginia', 'Vermont', 'Washington', 'Wisconsin',
                'West Virginia', 'Wyoming']
month_lookup = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October',
                'November', 'December']
year_lookup = []

for i in range(35):
    year_lookup.append(str(1980 + i))

data = []
for i in range(len(state_lookup)):
    for j in range(len(year_lookup)):
        for k in range(12):
            data.append({'state': state_lookup[i], 'year': year_lookup[j], 'month': month_lookup[k],
            'total_incidents': 0, 'handgun_incidents' : 0, 'shotgun_incidents': 0, 'rifle_incidents': 0,
            'firearm_incidents': 0, 'knife_incidents':0, 'other_weapon_incidents': 0,
            'sibling_incidents': 0, 'spouse_incidents': 0, 'parent_incidents': 0, 'child_incidents': 0,
            'dating_incidents': 0, 'other_relations_incidents': 0, 'accidental_incidents': 0, 'intentional_incidents': 0})

with open("database.csv", newline = '') as csvfile:
    csvreader = csv.reader(csvfile)
    row = next(csvreader)
    print(row)
    for row in csvreader:
        index = state_lookup.index(row[5]) * 420 + year_lookup.index(row[6]) * 12 + month_lookup.index(row[7])
        data[index]['total_incidents'] += 1

        # Check accidental/intentional
        if row[9].__contains__('Murder'):
            data[index]['intentional_incidents'] += 1
        else:
            data[index]['accidental_incidents'] += 1

        # Check relation
        if row[19] == 'Mother' or row[19] == 'Father':
            data[index]['parent_incidents'] += 1
        elif row[19] == 'Boyfriend' or row[19] == 'Girlfriend':
            data[index]['dating_incidents'] += 1
        elif row[19] == 'Son' or row[19] == 'Daughter':
            data[index]['child_incidents'] += 1
        elif row[19].__contains__('Husband') or row[19].__contains__('Wife'):
            data[index]['spouse_incidents'] += 1
        elif row[19] == 'Brother' or row[19] == 'Sister':
            data[index]['sibling_incidents'] += 1
        else:
            data[index]['other_relations_incidents'] += 1

        # Check weapon type
        if row[20] == 'Handgun':
            data[index]['handgun_incidents'] += 1
        elif row[20] == 'Shotgun':
            data[index]['shotgun_incidents'] += 1
        elif row[20] == 'Rifle':
            data[index]['rifle_incidents'] += 1
        elif row[20] == 'Firearm':
            data[index]['firearm_incidents'] += 1
        elif row[20] == 'Knife':
            data[index]['knife_incidents'] += 1
        else:
            data[index]['other_weapon_incidents'] += 1

# {'state': state_lookup[i], 'year': year_lookup[j], 'month': month_lookup[k],
#             'total_incidents': 0, 'handgun_incidents' : 0, 'shotgun_incidents': 0, 'rifle_incidents': 0,
#             'firearm_incidents': 0, 'knife_incidents':0, 'other_weapon_incidents': 0,
#             'sibling_incidents': 0, 'spouse_incidents': 0, 'parent_incidents': 0, 'child_incidents': 0,
            # 'dating_incidents': 0, 'other_relations_incidents': 0, 'accidental_incidents': 0, 'intentional_incidents': 0})
with open('parsed_data.csv', 'w', newline='') as csvfile:
    csvwriter = csv.writer(csvfile)
    row = ['state', 'year', 'month', 'handgun_incidents', 'shotgun_incidents', 'rifle_incidents', 'firearm_incidents',
           'knife_incidents', 'other_weapon_incidents', 'sibling_incidents', 'spouse_incidents', 'parent_incidents',
           'child_incidents', 'dating_incidents', 'other_relations_incidents', 'accidental_incidents', 'intentional_incidents',
           'total_incidents']
    csvwriter.writerow(row)

    for e in data:
        row = []
        row.append(e['state'])
        row.append(e['year'])
        row.append(e['month'])
        row.append(e['handgun_incidents'])
        row.append(e['shotgun_incidents'])
        row.append(e['rifle_incidents'])
        row.append(e['firearm_incidents'])
        row.append(e['knife_incidents'])
        row.append(e['other_weapon_incidents'])
        row.append(e['sibling_incidents'])
        row.append(e['spouse_incidents'])
        row.append(e['parent_incidents'])
        row.append(e['child_incidents'])
        row.append(e['dating_incidents'])
        row.append(e['other_relations_incidents'])
        row.append(e['accidental_incidents'])
        row.append(e['intentional_incidents'])
        row.append(e['total_incidents'])
        csvwriter.writerow(row)


