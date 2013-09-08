<?php

//
// Quick script to generate a bunch of students to look-up
//

const NUM_STUDENTS_TO_CREATE = 100;

// Available random options
$firstNames = array('John', 'Steve', 'Mike', 'Paul', 'Sean', 'Alex', 'Tim', 'Todd', 'Ben', 'Cory', 'Ted', 'Joe', 'Richard', 'Ryan',
    'Ashley', 'Teri', 'Michelle', 'Samantha', 'Annie', 'Cathy', 'Jen', 'Lauren', 'Rachel', 'Kelly', 'Hilda', 'Hillary');
$lastNames = array('Smith', 'Janis', 'Welch', 'Brookstone', 'Dexter', 'Souter',
    'Kowalski', 'Michaels', 'Phillips', 'Ryder', 'Lawson', 'Wu', 'Templeton', 'Rudy', 'Kane', 'West', 'Wood', 'Anderson');
$schools = array('Stanford', 'Harvard', 'RIT', 'Berkeley', 'MIT', 'Georgia Tech',
    'Carnegie Mellon', 'Dartmouth', 'Yale', 'Princeton', 'Cornell', 'Cal Poly', 'UCSD', 'Kansas State', 'Ohio State' );
$degrees = array('CS', 'MBA', 'MSEE', 'MFA', 'CE', 'SE', 'PhD');
$graduationYears = array(2013, 2014, 2015, 2016, 2017);
$skills = array("Git", "Business", "C++", "Java", "Computer Graphics",
    "Growth", "Revenue", "Actionscript", "3D", "Early stage start-ups", "PHP", "RoR", "Python",
    "OpenGL", "DirectX", "Multilingual", "VC Funding", "Software Development", "C", "iOS", "Android", "Mobile");

$picUrls = array(
    'img/students/06730120effc62b260d7ae7679632856.jpg',
    'img/students/06eb85e0a7f7c9618ad131830db85abe.jpg',
    'img/students/0b68fe8a46c1fcb6edd37e860ba872d0.jpg',
    'img/students/12a7921d45db7fca735070ffd3f034d1.jpg',
    'img/students/12c5b82d6acbbe3416f89db0d157db8a.jpg',
    'img/students/14aadd7bd798bee1d58715025a9677c9.jpg',
    'img/students/14bb9ffb2712b6e3fd5667e62d0a381d.jpg',
    'img/students/1bc31ecc6ff49e1c6a92004060e7e30c.jpg',
    'img/students/1e284c9a02da504dc8bdd5cdc8453017.jpg',
    'img/students/1e46c35c3619e9605da9ae42a4c98187.jpg',
    'img/students/20595f4da803659dd27223f606fd83c9.jpg',
    'img/students/2070ffd8059148193ac88c3090cd36a1.jpg',
    'img/students/251f4633e311b37bbfed6f4e77522411.jpg',
    'img/students/27c30de5e7674ccbf41c1358cf25640e.jpg',
    'img/students/316b37d1ceff65d4a4402c8c20b86379.jpg',
    'img/students/3428d426fd88bcf64d858c07f38b07e4.jpg',
    'img/students/35996ff6bd9a9e25304d4ab285002699.jpg',
    'img/students/36a583a6145bc9118c69a20fdc96d14a.jpg',
    'img/students/3d4a15216459359e0b836da6391f08a6.jpg',
    'img/students/3ded17d00bf18fa7e4809c61648e2ed4.jpg',
    'img/students/3dfad3b4f176fe71aef9620b42d2a989.jpg',
    'img/students/449a4f63a13797cef6c47bb731bb86ef.jpg',
    'img/students/46015ba5edf48b5f229085a89e951065.jpg',
    'img/students/4652e05d5c424122fdae62ce4f6a4cf1.jpg',
    'img/students/5a68f6ac5f0f00d7d132dca20d5284b0.jpg',
    'img/students/5aab4aa815d8688edc048d90558741fc.jpg',
    'img/students/5f8f000bc6db4b5d21c9803bb355184c.jpg',
    'img/students/6415d5351e8311f1ea3099544d3de45d.jpg',
    'img/students/72fbca19059b2b9a12cff1018c613e07.jpg',
    'img/students/7ac40b8590feaceb87df8b15c8513fd2.jpg',
    'img/students/7e4ebd6c1516c08590e0de777131ba9b.jpg',
    'img/students/9b4234bc7fb6751edeb0e6ddf1ad9f4c.jpg',
    'img/students/ae59c4292203b9408c4106ff6c4bdb2a.jpg',
    'img/students/af8708448057c1166fd70d32a8380640.jpg',
    'img/students/bddfe94a8166f17c29c86f571ecf1df6.jpg',
    'img/students/c6240918409048e8f8944b7392cf143c.jpg',
    'img/students/c791946e18707f560abdde82d74506c4.jpg',
    'img/students/d0e11d0cc0e7490eea112e4f073e4aad.jpg',
    'img/students/d16628ac25852829ca5cb6963360ab9e.jpg',
    'img/students/d3317d3640ac86b2d1a2998dd1be5af8.jpg',
    'img/students/dbff84ba0d87c381b50b33c31941bcf0.jpg',
    'img/students/dd0a074420f957253ab9d14c2525373a.jpg',
    'img/students/df045a01c12e52f7e80da942e556fefd.jpg',
    'img/students/eed4301bc32bda242e783d31f2ba67c8.jpg',
    'img/students/f3345bc5aa749f60081b2ef193f97d67.jpg',
    'img/students/f3b50435d1118f78679b2c1fc359631a.jpg',
    'img/students/fbe3642a62728a037c9c7d85cfa3799a.jpg'
);


//
// Now randomly create n-many students with pseudo-random
// properties and images.
//
$result = array();
for ($i = 0; $i < NUM_STUDENTS_TO_CREATE; $i++) {
   $friendlyName = $firstNames[rand(0, count($firstNames)-1)] . ' ' . $lastNames[rand(0, count($lastNames)-1)];
   $school = $schools[rand(0, count($schools)-1)];
   $degreeAbbrev = $degrees[rand(0, count($degrees)-1)];
   $graduationYear = $graduationYears[rand(0, count($graduationYears)-1)];
   $picUrl = $picUrls[rand(0, count($picUrls)-1)];

   $numSkillsToPick = rand(1, 5);
   shuffle($skills);
   $userSkills = array_rand($skills, $numSkillsToPick);
   $mySkills = array();

   for ($j = 0; $j < count($userSkills); $j++) {
       $mySkills[] = $skills[$j];
   }

   $result[] = array(
       'friendlyName' => $friendlyName,
       'school' => $school,
       'degreeAbbrev' => $degreeAbbrev,
       'degreeYear' => $graduationYear,
       'picUrl' => $picUrl,
       'skills' => $mySkills
   );
}

//
// Close the file reference
//
$fp = fopen('../public/test_students/test_students.json', 'w');
fwrite($fp, json_encode($result));
fclose($fp);